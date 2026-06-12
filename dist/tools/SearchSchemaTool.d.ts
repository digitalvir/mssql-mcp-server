import { Tool } from "@modelcontextprotocol/sdk/types.js";
type SearchParams = {
    tablePattern?: string;
    columnPattern?: string;
    limit?: number;
    tableLimit?: number;
    columnLimit?: number;
    tableOffset?: number;
    columnOffset?: number;
};
type PaginationInfo = {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
};
type SearchResult = {
    success: boolean;
    message?: string;
    totalTables?: number;
    totalColumns?: number;
    tables?: Array<{
        schemaName: string;
        tableName: string;
    }>;
    columns?: Array<{
        schemaName: string;
        tableName: string;
        columnName: string;
        dataType: string;
    }>;
    fuzzySuggestions?: Array<{
        schemaName: string;
        tableName: string;
        similarity: number;
    }>;
    fuzzySearchTerm?: string;
    tablesPage?: PaginationInfo;
    columnsPage?: PaginationInfo;
};
export declare class SearchSchemaTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly tablePattern: {
                readonly type: "string";
                readonly description: "Wildcard pattern for table names (e.g. 'doc%').";
            };
            readonly columnPattern: {
                readonly type: "string";
                readonly description: "Wildcard pattern for column names (e.g. '%id').";
            };
            readonly limit: {
                readonly type: "number";
                readonly description: "Maximum rows to return per section (default 50, max 200).";
            };
            readonly tableLimit: {
                readonly type: "number";
                readonly description: "Override for table section limit (defaults to limit).";
            };
            readonly columnLimit: {
                readonly type: "number";
                readonly description: "Override for column section limit (defaults to limit).";
            };
            readonly tableOffset: {
                readonly type: "number";
                readonly description: "Number of table rows to skip (for pagination).";
            };
            readonly columnOffset: {
                readonly type: "number";
                readonly description: "Number of column rows to skip (for pagination).";
            };
            readonly environment: {
                readonly type: "string";
                readonly description: "Optional environment name to target.";
            };
        };
    };
    private normalizePattern;
    private stripWildcards;
    private normalizeLimit;
    private normalizeOffset;
    private levenshteinDistance;
    private calculateSimilarity;
    private findSimilarTables;
    run(params: SearchParams): Promise<SearchResult>;
}
export {};
//# sourceMappingURL=SearchSchemaTool.d.ts.map