import sql from "mssql";
import { getEnvironmentManager } from "../config/EnvironmentManager.js";
export class RawQueryTool {
    constructor() {
        this.name = "raw_query";
        this.description = "WRITE/DDL escape hatch — executes arbitrary SQL (EXEC of stored procedures, multi-statement batches, INSERT/UPDATE/DELETE, DDL). No validation. REJECTED on read-only environments with ENVIRONMENT_READONLY — usable only against a writable environment. For reads on ANY environment (including read-only ones), use read_data instead. Returns all recordsets the query produced. Use with intent.";
        this.inputSchema = {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Any SQL — SELECT, EXEC <proc>, INSERT, multi-statement, etc.",
                },
                database: {
                    type: "string",
                    description: "Optional database name. If provided, USE [db] is prepended (requires server-level access for cross-DB).",
                },
                environment: {
                    type: "string",
                    description: "Environment to target. Must be a writable environment — read-only environments reject this tool with ENVIRONMENT_READONLY. The default environment may be read-only, so set this explicitly to a writable one.",
                },
            },
            required: ["query"],
        };
    }
    async run(params) {
        try {
            const { query, database, environment } = params;
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
            let finalQuery = query;
            if (database) {
                const safeDbName = database.replace(/]/g, "]]");
                finalQuery = `USE [${safeDbName}]; ${query}`;
            }
            console.error(`raw_query${database ? ` on [${database}]` : ""}: ${finalQuery.substring(0, 200)}${finalQuery.length > 200 ? "..." : ""}`);
            const request = new sql.Request(params.pool);
            const result = await request.query(finalQuery);
            const recordsets = result.recordsets || [];
            return {
                success: true,
                message: `Executed. ${recordsets.length} recordset(s).${result.rowsAffected ? ` rowsAffected: ${JSON.stringify(result.rowsAffected)}` : ""}`,
                database: database || undefined,
                data: result.recordset || [],
                recordsets,
                rowsAffected: result.rowsAffected,
                recordCount: (result.recordset || []).length,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            return {
                success: false,
                message: `Failed to execute raw query: ${errorMessage}`,
                error: "QUERY_EXECUTION_FAILED",
            };
        }
    }
}
//# sourceMappingURL=RawQueryTool.js.map