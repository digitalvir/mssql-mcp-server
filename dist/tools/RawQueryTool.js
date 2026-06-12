import sql from "mssql";
import { getEnvironmentManager } from "../config/EnvironmentManager.js";
export class RawQueryTool {
    constructor() {
        this.name = "raw_query";
        this.description = "Executes arbitrary SQL — including EXEC of stored procedures, multi-statement batches, and DDL. No validation. Returns all recordsets the query produced. Use with intent.";
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
                    description: "Optional environment name to target.",
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