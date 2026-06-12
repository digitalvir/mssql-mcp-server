import type { AuditSink } from "./AuditSink.js";
import type { AuditLogEntry } from "../AuditLogger.js";
export interface AzureMonitorSinkConfig {
    workspaceId: string;
    sharedKey: string;
    logType?: string;
    batchSize?: number;
    flushIntervalMs?: number;
}
export declare class AzureMonitorSink implements AuditSink {
    readonly type = "azure-monitor";
    private readonly workspaceId;
    private readonly sharedKey;
    private readonly logType;
    private readonly batchSize;
    private readonly flushIntervalMs;
    private buffer;
    private timer;
    constructor(config: AzureMonitorSinkConfig);
    send(entry: AuditLogEntry): void;
    flush(): Promise<void>;
    close(): Promise<void>;
    private buildSignature;
}
//# sourceMappingURL=AzureMonitorSink.d.ts.map