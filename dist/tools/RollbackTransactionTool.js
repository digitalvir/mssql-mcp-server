export class RollbackTransactionTool {
    constructor() {
        this.name = "rollback_transaction";
        this.description = "Rolls back the active transaction for the target environment, discarding all operations within it.";
        this.inputSchema = {
            type: "object",
            properties: {
                environment: {
                    type: "string",
                    description: "Optional environment name to target.",
                },
            },
            required: [],
        };
    }
    async run(params) {
        try {
            const { environment, transactionManager } = params;
            if (!transactionManager) {
                return {
                    success: false,
                    message: "Transaction support is not enabled on this server.",
                    error: "TRANSACTIONS_DISABLED",
                };
            }
            const { operationCount } = await transactionManager.rollback(environment);
            return {
                success: true,
                message: `Transaction rolled back for environment '${environment}'. ${operationCount} operation(s) discarded.`,
                environment,
                operationCount,
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Failed to rollback transaction: ${error}`,
                error: "ROLLBACK_FAILED",
            };
        }
    }
}
//# sourceMappingURL=RollbackTransactionTool.js.map