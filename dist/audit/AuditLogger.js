import * as fs from "fs";
import * as path from "path";
export class AuditLogger {
    constructor() {
        this.sinksConfigured = false;
        // Read config from env vars
        const logPath = process.env.AUDIT_LOG_PATH;
        this.enabled = process.env.AUDIT_LOGGING !== "false"; // Enabled by default
        this.redactSensitiveData = process.env.AUDIT_REDACT_SENSITIVE !== "false"; // Redact by default
        if (this.enabled && logPath) {
            this.logFilePath = path.resolve(logPath);
            this.ensureLogDirectory();
        }
        else if (this.enabled) {
            // Default to logs/audit.jsonl in the project root
            this.logFilePath = path.resolve(process.cwd(), "logs", "audit.jsonl");
            this.ensureLogDirectory();
        }
        else {
            this.logFilePath = "";
        }
    }
    /**
     * Configure audit sinks for dispatching log entries.
     * Once called, log entries are routed to sinks instead of direct file writes.
     *
     * @param globalSinks - Default sinks used when an environment has no specific sinks
     * @param perEnvSinks - Environment-specific sinks (environment name → sink array)
     */
    configureSinks(globalSinks, perEnvSinks) {
        this.sinks = new Map();
        this.sinks.set("*", globalSinks);
        for (const [envName, envSinks] of perEnvSinks) {
            this.sinks.set(envName, envSinks);
        }
        this.sinksConfigured = true;
    }
    ensureLogDirectory() {
        if (!this.logFilePath)
            return;
        const dir = path.dirname(this.logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    redactArguments(args) {
        if (!this.redactSensitiveData) {
            // Still strip non-serializable objects even when redaction is off
            const { pool, environmentPolicy, ...safe } = args;
            return safe;
        }
        const { pool, environmentPolicy, ...rest } = args;
        const redacted = { ...rest };
        const sensitiveKeys = [
            "password",
            "secret",
            "token",
            "key",
            "authorization",
            "auth",
            "credential",
        ];
        for (const [key, value] of Object.entries(redacted)) {
            const lowerKey = key.toLowerCase();
            if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
                redacted[key] = "[REDACTED]";
            }
            else if (typeof value === "string" && value.length > 500) {
                // Truncate very long strings (likely large query results)
                redacted[key] = value.substring(0, 500) + "... [TRUNCATED]";
            }
        }
        return redacted;
    }
    /**
     * Get the sink array for a given environment name.
     * Falls back to global sinks ("*") if no environment-specific sinks are configured.
     */
    getSinksForEnvironment(environment) {
        if (!this.sinks)
            return undefined;
        if (environment && this.sinks.has(environment)) {
            return this.sinks.get(environment);
        }
        return this.sinks.get("*");
    }
    log(entry) {
        if (!this.enabled) {
            return;
        }
        try {
            const logEntry = {
                ...entry,
                arguments: entry.arguments ? this.redactArguments(entry.arguments) : undefined,
            };
            // If sinks are configured, dispatch to the appropriate sinks
            if (this.sinksConfigured) {
                const sinks = this.getSinksForEnvironment(logEntry.environment);
                if (sinks) {
                    for (const sink of sinks) {
                        try {
                            const result = sink.send(logEntry);
                            // If send returns a promise, catch errors without blocking
                            if (result && typeof result.catch === "function") {
                                result.catch((err) => {
                                    console.error(`Audit sink '${sink.type}' failed:`, err);
                                });
                            }
                        }
                        catch (err) {
                            console.error(`Audit sink '${sink.type}' failed:`, err);
                        }
                    }
                }
                return;
            }
            // Legacy behavior: direct file write when no sinks configured
            if (!this.logFilePath)
                return;
            const logLine = JSON.stringify(logEntry) + "\n";
            fs.appendFileSync(this.logFilePath, logLine, { encoding: "utf-8" });
        }
        catch (error) {
            console.error("Failed to write audit log:", error);
        }
    }
    logToolInvocation(toolName, args, result, durationMs, options) {
        const auditLevel = options?.auditLevel ?? "basic";
        // Skip logging entirely for 'none' level
        if (auditLevel === "none") {
            return;
        }
        // Basic level: minimal info (tool name, success, timing, environment)
        if (auditLevel === "basic") {
            const entry = {
                timestamp: new Date().toISOString(),
                toolName,
                environment: options?.environment,
                result: {
                    success: result?.success ?? false,
                    recordCount: result?.recordCount ?? result?.rowsAffected,
                    error: result?.error,
                },
                durationMs: Math.round(durationMs),
                sessionId: options?.sessionId,
                userId: options?.userId,
            };
            this.log(entry);
            return;
        }
        // Verbose level: full arguments and result data
        const entry = {
            timestamp: new Date().toISOString(),
            toolName,
            environment: options?.environment,
            arguments: args || {},
            result: {
                success: result?.success ?? false,
                recordCount: result?.recordCount ?? result?.rowsAffected,
                error: result?.error,
                data: this.truncateResultData(result?.data),
            },
            durationMs: Math.round(durationMs),
            sessionId: options?.sessionId,
            userId: options?.userId,
        };
        this.log(entry);
    }
    /**
     * Flush all buffered entries in batching sinks.
     */
    async flush() {
        if (!this.sinks)
            return;
        const promises = [];
        const seen = new Set();
        for (const sinkList of this.sinks.values()) {
            for (const sink of sinkList) {
                if (!seen.has(sink) && sink.flush) {
                    seen.add(sink);
                    promises.push(sink.flush().catch((err) => {
                        console.error(`Audit sink '${sink.type}' flush failed:`, err);
                    }));
                }
            }
        }
        await Promise.all(promises);
    }
    /**
     * Close all sinks and release resources.
     */
    async close() {
        if (!this.sinks)
            return;
        const promises = [];
        const seen = new Set();
        for (const sinkList of this.sinks.values()) {
            for (const sink of sinkList) {
                if (!seen.has(sink) && sink.close) {
                    seen.add(sink);
                    promises.push(sink.close().catch((err) => {
                        console.error(`Audit sink '${sink.type}' close failed:`, err);
                    }));
                }
            }
        }
        await Promise.all(promises);
    }
    /**
     * Truncate result data for verbose logging to prevent huge log entries
     */
    truncateResultData(data) {
        if (!data)
            return undefined;
        // If it's an array, limit to first 10 items
        if (Array.isArray(data)) {
            if (data.length > 10) {
                return {
                    _truncated: true,
                    _totalCount: data.length,
                    items: data.slice(0, 10),
                };
            }
            return data;
        }
        // If it's a large object (stringified > 10KB), truncate
        const stringified = JSON.stringify(data);
        if (stringified.length > 10000) {
            return {
                _truncated: true,
                _originalSize: stringified.length,
                preview: stringified.substring(0, 1000) + "...",
            };
        }
        return data;
    }
}
// Singleton instance
export const auditLogger = new AuditLogger();
//# sourceMappingURL=AuditLogger.js.map