import sql from "mssql";
export interface ActiveTransaction {
    transaction: sql.Transaction;
    environmentName: string;
    startedAt: Date;
    operations: {
        tool: string;
        table: string;
        timestamp: Date;
    }[];
}
/**
 * Creates a sql.Request bound to an active transaction if one exists,
 * otherwise bound to the connection pool.
 */
export declare function createRequest(params: {
    pool: sql.ConnectionPool;
    transaction?: sql.Transaction;
}): sql.Request;
/**
 * Manages active transactions per environment.
 * One active transaction per environment at a time.
 * Auto-rollback after configurable timeout (default 5 minutes).
 */
export declare class TransactionManager {
    private active;
    private timers;
    private timeoutMs;
    constructor(timeoutMs?: number);
    begin(envName: string, pool: sql.ConnectionPool): Promise<void>;
    getTransaction(envName: string): ActiveTransaction | undefined;
    hasActiveTransaction(envName: string): boolean;
    recordOperation(envName: string, tool: string, table: string): void;
    commit(envName: string): Promise<{
        operationCount: number;
    }>;
    rollback(envName: string): Promise<{
        operationCount: number;
    }>;
    private cleanup;
}
//# sourceMappingURL=TransactionManager.d.ts.map