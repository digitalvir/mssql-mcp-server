import type { AuditSink } from "./sinks/AuditSink.js";
export type AuditLevel = "none" | "basic" | "verbose";
export interface AuditLogEntry {
    timestamp: string;
    toolName: string;
    environment?: string;
    arguments?: Record<string, any>;
    result?: {
        success: boolean;
        recordCount?: number;
        error?: string;
        data?: any;
    };
    durationMs?: number;
    sessionId?: string;
    userId?: string;
}
export declare class AuditLogger {
    private readonly logFilePath;
    private readonly enabled;
    private readonly redactSensitiveData;
    /** environment name → sinks. Key "*" is global/default. */
    private sinks;
    private sinksConfigured;
    constructor();
    /**
     * Configure audit sinks for dispatching log entries.
     * Once called, log entries are routed to sinks instead of direct file writes.
     *
     * @param globalSinks - Default sinks used when an environment has no specific sinks
     * @param perEnvSinks - Environment-specific sinks (environment name → sink array)
     */
    configureSinks(globalSinks: AuditSink[], perEnvSinks: Map<string, AuditSink[]>): void;
    private ensureLogDirectory;
    private redactArguments;
    /**
     * Get the sink array for a given environment name.
     * Falls back to global sinks ("*") if no environment-specific sinks are configured.
     */
    private getSinksForEnvironment;
    log(entry: AuditLogEntry): void;
    logToolInvocation(toolName: string, args: any, result: any, durationMs: number, options?: {
        sessionId?: string;
        userId?: string;
        environment?: string;
        auditLevel?: AuditLevel;
    }): void;
    /**
     * Flush all buffered entries in batching sinks.
     */
    flush(): Promise<void>;
    /**
     * Close all sinks and release resources.
     */
    close(): Promise<void>;
    /**
     * Truncate result data for verbose logging to prevent huge log entries
     */
    private truncateResultData;
}
export declare const auditLogger: AuditLogger;
//# sourceMappingURL=AuditLogger.d.ts.map