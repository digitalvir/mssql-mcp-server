import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ReadDataTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    private readonly defaultMaxRows;
    inputSchema: any;
    constructor();
    private static readonly DANGEROUS_KEYWORDS;
    private static readonly DANGEROUS_PATTERNS;
    /**
     * Validates the SQL query for security issues
     * @param query The SQL query to validate
     * @returns Validation result with success flag and error message if invalid
     */
    private validateQuery;
    /**
     * Enforces row limit by injecting TOP n if not already present
     * @param query The validated SQL query
     * @returns Query with TOP clause if needed, plus flag indicating if limit was added
     */
    private enforceRowLimit;
    /**
     * Resolves the maximum number of rows to return based on the input parameters and environment policy.
     * Priority: environment policy maxRowsDefault (enforced cap) > user-specified maxRows > tool default
     * @param params Input parameters including environmentPolicy
     * @returns Maximum number of rows to return
     */
    private resolveMaxRows;
    /**
     * Sanitizes the query result to prevent any potential security issues
     * @param data The query result data
     * @returns Sanitized data
     */
    private sanitizeResult;
    /**
     * Executes the validated SQL query
     * @param params Query parameters
     * @returns Query execution result
     */
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        database?: undefined;
        data?: undefined;
        recordCount?: undefined;
        totalRecords?: undefined;
        autoLimited?: undefined;
    } | {
        success: boolean;
        message: string;
        database: any;
        data: any[];
        recordCount: number;
        totalRecords: number;
        autoLimited: boolean;
        error?: undefined;
    }>;
}
//# sourceMappingURL=ReadDataTool.d.ts.map