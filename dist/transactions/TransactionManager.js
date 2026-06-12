import sql from "mssql";
/**
 * Creates a sql.Request bound to an active transaction if one exists,
 * otherwise bound to the connection pool.
 */
export function createRequest(params) {
    return params.transaction
        ? params.transaction.request()
        : new sql.Request(params.pool);
}
/**
 * Manages active transactions per environment.
 * One active transaction per environment at a time.
 * Auto-rollback after configurable timeout (default 5 minutes).
 */
export class TransactionManager {
    constructor(timeoutMs = 5 * 60 * 1000) {
        this.active = new Map();
        this.timers = new Map();
        this.timeoutMs = timeoutMs;
    }
    async begin(envName, pool) {
        if (this.active.has(envName)) {
            throw new Error(`A transaction is already active for environment '${envName}'. ` +
                `Commit or rollback the current transaction before starting a new one.`);
        }
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        this.active.set(envName, {
            transaction,
            environmentName: envName,
            startedAt: new Date(),
            operations: [],
        });
        // Auto-rollback timer (unref'd so it doesn't keep the process alive)
        const timer = setTimeout(async () => {
            if (this.active.has(envName)) {
                try {
                    await this.rollback(envName);
                    console.warn(`[TransactionManager] Auto-rolled back transaction for '${envName}' after ${this.timeoutMs / 1000}s timeout.`);
                }
                catch {
                    // Transaction may already be dead
                }
            }
        }, this.timeoutMs);
        timer.unref();
        this.timers.set(envName, timer);
    }
    getTransaction(envName) {
        return this.active.get(envName);
    }
    hasActiveTransaction(envName) {
        return this.active.has(envName);
    }
    recordOperation(envName, tool, table) {
        const txn = this.active.get(envName);
        if (txn) {
            txn.operations.push({ tool, table, timestamp: new Date() });
        }
    }
    async commit(envName) {
        const txn = this.active.get(envName);
        if (!txn) {
            throw new Error(`No active transaction for environment '${envName}'.`);
        }
        const operationCount = txn.operations.length;
        try {
            await txn.transaction.commit();
        }
        finally {
            this.cleanup(envName);
        }
        return { operationCount };
    }
    async rollback(envName) {
        const txn = this.active.get(envName);
        if (!txn) {
            throw new Error(`No active transaction for environment '${envName}'.`);
        }
        const operationCount = txn.operations.length;
        try {
            await txn.transaction.rollback();
        }
        finally {
            this.cleanup(envName);
        }
        return { operationCount };
    }
    cleanup(envName) {
        this.active.delete(envName);
        const timer = this.timers.get(envName);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(envName);
        }
    }
}
//# sourceMappingURL=TransactionManager.js.map