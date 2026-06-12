import sql from "mssql";
import { getEnvironmentManager } from "../config/EnvironmentManager.js";
export class DescribeTableTool {
    constructor() {
        this.name = "describe_table";
        this.description = "Describes the schema (columns and types) of a specified MSSQL Database table. " +
            "For server-level access environments, you can specify a database to target.";
        this.inputSchema = {
            type: "object",
            properties: {
                tableName: {
                    type: "string",
                    description: "Name of the table to describe (can include schema: 'dbo.TableName')",
                },
                database: {
                    type: "string",
                    description: "Optional: Target database name for server-level access environments.",
                },
                environment: {
                    type: "string",
                    description: "Optional environment name to target.",
                },
            },
            required: ["tableName"],
        };
    }
    async run(params) {
        try {
            const { tableName, database, environment } = params;
            // Validate tableName
            if (!tableName || typeof tableName !== "string") {
                return {
                    success: false,
                    message: "Missing or invalid 'tableName' argument.",
                    error: "INVALID_ARGUMENT",
                };
            }
            // Validate database access if specified
            if (database) {
                const envManager = await getEnvironmentManager();
                const dbCheck = envManager.isDatabaseAllowed(environment, database);
                if (!dbCheck.allowed) {
                    return {
                        success: false,
                        message: dbCheck.reason || `Access to database '${database}' is not allowed.`,
                        error: "DATABASE_ACCESS_DENIED",
                    };
                }
            }
            // Parse schema and table name
            let schemaName = "dbo";
            let actualTableName = tableName;
            if (tableName.includes(".")) {
                const parts = tableName.split(".");
                schemaName = parts[0];
                actualTableName = parts[1];
            }
            const request = new sql.Request(params.pool);
            // Build query with optional database context
            let query;
            if (database) {
                const safeDbName = database.replace(/]/g, "]]");
                query = `
          USE [${safeDbName}];
          SELECT
            COLUMN_NAME as name,
            DATA_TYPE as type,
            CHARACTER_MAXIMUM_LENGTH as max_length,
            IS_NULLABLE as nullable,
            COLUMN_DEFAULT as default_value,
            ORDINAL_POSITION as position
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = @tableName AND TABLE_SCHEMA = @schemaName
          ORDER BY ORDINAL_POSITION
        `;
            }
            else {
                query = `
          SELECT
            COLUMN_NAME as name,
            DATA_TYPE as type,
            CHARACTER_MAXIMUM_LENGTH as max_length,
            IS_NULLABLE as nullable,
            COLUMN_DEFAULT as default_value,
            ORDINAL_POSITION as position
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME = @tableName AND TABLE_SCHEMA = @schemaName
          ORDER BY ORDINAL_POSITION
        `;
            }
            request.input("tableName", sql.NVarChar, actualTableName);
            request.input("schemaName", sql.NVarChar, schemaName);
            const result = await request.query(query);
            if (result.recordset.length === 0) {
                return {
                    success: false,
                    message: `Table '${schemaName}.${actualTableName}' not found${database ? ` in database [${database}]` : ""}.`,
                    error: "TABLE_NOT_FOUND",
                };
            }
            return {
                success: true,
                message: `Described table '${schemaName}.${actualTableName}'${database ? ` in [${database}]` : ""}`,
                database: database || undefined,
                schema: schemaName,
                tableName: actualTableName,
                columnCount: result.recordset.length,
                columns: result.recordset,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to describe table: ${error}`,
                error: "QUERY_FAILED",
            };
        }
    }
}
//# sourceMappingURL=DescribeTableTool.js.map