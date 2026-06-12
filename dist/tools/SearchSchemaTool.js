import sql from "mssql";
const clampEnvLimit = (value, fallback, max) => {
    if (!value) {
        return fallback;
    }
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.min(parsed, max);
};
const SEARCH_DEFAULT_LIMIT = clampEnvLimit(process.env.SEARCH_SCHEMA_DEFAULT_LIMIT, 50, 200);
export class SearchSchemaTool {
    constructor() {
        this.name = "search_schema";
        this.description = "Searches tables and columns using wildcard patterns to discover schema names.";
        this.inputSchema = {
            type: "object",
            properties: {
                tablePattern: {
                    type: "string",
                    description: "Wildcard pattern for table names (e.g. 'doc%')."
                },
                columnPattern: {
                    type: "string",
                    description: "Wildcard pattern for column names (e.g. '%id')."
                },
                limit: {
                    type: "number",
                    description: "Maximum rows to return per section (default 50, max 200)."
                },
                tableLimit: {
                    type: "number",
                    description: "Override for table section limit (defaults to limit)."
                },
                columnLimit: {
                    type: "number",
                    description: "Override for column section limit (defaults to limit)."
                },
                tableOffset: {
                    type: "number",
                    description: "Number of table rows to skip (for pagination)."
                },
                columnOffset: {
                    type: "number",
                    description: "Number of column rows to skip (for pagination)."
                },
                environment: {
                    type: "string",
                    description: "Optional environment name to target."
                }
            }
        };
    }
    normalizePattern(value) {
        if (!value) {
            return null;
        }
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }
        return `%${trimmed.replace(/%/g, "%").replace(/_/g, "_")}%`;
    }
    stripWildcards(value) {
        if (!value) {
            return null;
        }
        return value.replace(/[\%_]/g, "").trim() || null;
    }
    normalizeLimit(value, fallback = 50) {
        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return fallback;
        }
        return Math.min(Math.floor(value), 200);
    }
    normalizeOffset(value) {
        if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
            return 0;
        }
        return Math.floor(value);
    }
    levenshteinDistance(a, b) {
        const rows = a.length + 1;
        const cols = b.length + 1;
        const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
        for (let i = 0; i < rows; i++) {
            matrix[i][0] = i;
        }
        for (let j = 0; j < cols; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i < rows; i++) {
            for (let j = 1; j < cols; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
            }
        }
        return matrix[rows - 1][cols - 1];
    }
    calculateSimilarity(a, b) {
        if (!a || !b) {
            return 0;
        }
        const lowerA = a.toLowerCase();
        const lowerB = b.toLowerCase();
        const distance = this.levenshteinDistance(lowerA, lowerB);
        const maxLength = Math.max(lowerA.length, lowerB.length, 1);
        return 1 - distance / maxLength;
    }
    async findSimilarTables(searchTerm, maxSuggestions, pool) {
        const request = new sql.Request(pool);
        const result = await request.query(`
      SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName
      FROM INFORMATION_SCHEMA.TABLES
    `);
        const suggestions = result.recordset
            .map((row) => ({
            ...row,
            similarity: this.calculateSimilarity(row.tableName, searchTerm)
        }))
            .filter((row) => row.similarity >= 0.5)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxSuggestions)
            .map((row) => ({
            schemaName: row.schemaName,
            tableName: row.tableName,
            similarity: Number(row.similarity.toFixed(3))
        }));
        return suggestions;
    }
    async run(params) {
        try {
            const rawTableSearch = this.stripWildcards(params.tablePattern);
            const tablePattern = this.normalizePattern(params.tablePattern);
            const columnPattern = this.normalizePattern(params.columnPattern);
            const limit = typeof params.limit === "number" && params.limit > 0 ? Math.min(params.limit, 200) : SEARCH_DEFAULT_LIMIT;
            const tableLimit = this.normalizeLimit(params.tableLimit, limit);
            const columnLimit = this.normalizeLimit(params.columnLimit, limit);
            const tableOffset = this.normalizeOffset(params.tableOffset);
            const columnOffset = this.normalizeOffset(params.columnOffset);
            if (!tablePattern && !columnPattern) {
                return {
                    success: false,
                    message: "Provide at least one of tablePattern or columnPattern."
                };
            }
            const pool = params.pool;
            const tablesRequest = new sql.Request(pool);
            tablesRequest.input("tablePattern", sql.NVarChar, tablePattern);
            tablesRequest.input("tableOffset", sql.Int, tableOffset);
            tablesRequest.input("tablesLimit", sql.Int, tableLimit);
            const columnsRequest = new sql.Request(pool);
            columnsRequest.input("tablePattern", sql.NVarChar, tablePattern);
            columnsRequest.input("columnPattern", sql.NVarChar, columnPattern);
            columnsRequest.input("columnOffset", sql.Int, columnOffset);
            columnsRequest.input("columnLimit", sql.Int, columnLimit);
            const tablesQuery = `
        SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName
        FROM INFORMATION_SCHEMA.TABLES
        WHERE (@tablePattern IS NULL OR TABLE_NAME LIKE @tablePattern)
        ORDER BY TABLE_SCHEMA, TABLE_NAME
        OFFSET @tableOffset ROWS
        FETCH NEXT @tablesLimit ROWS ONLY;

        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.TABLES
        WHERE (@tablePattern IS NULL OR TABLE_NAME LIKE @tablePattern)`;
            const columnsQuery = `
        SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName, COLUMN_NAME AS columnName, DATA_TYPE AS dataType
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (@tablePattern IS NULL OR TABLE_NAME LIKE @tablePattern)
          AND (@columnPattern IS NULL OR COLUMN_NAME LIKE @columnPattern)
        ORDER BY TABLE_SCHEMA, TABLE_NAME, ORDINAL_POSITION
        OFFSET @columnOffset ROWS
        FETCH NEXT @columnLimit ROWS ONLY;

        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (@tablePattern IS NULL OR TABLE_NAME LIKE @tablePattern)
          AND (@columnPattern IS NULL OR COLUMN_NAME LIKE @columnPattern)`;
            const [tablesResult, columnsResult] = await Promise.all([
                tablesRequest.query(tablesQuery),
                columnsRequest.query(columnsQuery)
            ]);
            const tableRecordsets = Array.isArray(tablesResult.recordsets) && tablesResult.recordsets.length
                ? tablesResult.recordsets
                : tablesResult.recordset
                    ? [tablesResult.recordset]
                    : [];
            const columnRecordsets = Array.isArray(columnsResult.recordsets) && columnsResult.recordsets.length
                ? columnsResult.recordsets
                : columnsResult.recordset
                    ? [columnsResult.recordset]
                    : [];
            const tableRecords = tableRecordsets[0] ?? [];
            const tableTotalRecord = tableRecordsets[1]?.[0];
            const totalTables = typeof tableTotalRecord?.total === "number" ? tableTotalRecord.total : tableRecords.length;
            const columnRecords = columnRecordsets[0] ?? [];
            const columnTotalRecord = columnRecordsets[1]?.[0];
            const totalColumns = typeof columnTotalRecord?.total === "number" ? columnTotalRecord.total : columnRecords.length;
            const response = {
                success: true,
                totalTables,
                totalColumns,
                tables: tableRecords,
                columns: columnRecords,
                tablesPage: {
                    offset: tableOffset,
                    limit: tableLimit,
                    total: totalTables,
                    hasMore: tableOffset + tableRecords.length < totalTables
                },
                columnsPage: {
                    offset: columnOffset,
                    limit: columnLimit,
                    total: totalColumns,
                    hasMore: columnOffset + columnRecords.length < totalColumns
                }
            };
            const needsFuzzyTables = Boolean(rawTableSearch &&
                !totalTables &&
                !totalColumns);
            if (needsFuzzyTables && rawTableSearch) {
                const fuzzySuggestions = await this.findSimilarTables(rawTableSearch, 10, pool);
                if (fuzzySuggestions.length) {
                    response.fuzzySuggestions = fuzzySuggestions;
                    response.fuzzySearchTerm = rawTableSearch;
                }
            }
            return response;
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to search schema: ${error}`
            };
        }
    }
}
//# sourceMappingURL=SearchSchemaTool.js.map