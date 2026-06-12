import type { AuditLogEntry } from "../AuditLogger.js";
export interface AuditSink {
    readonly type: string;
    send(entry: AuditLogEntry): void | Promise<void>;
    flush?(): Promise<void>;
    close?(): Promise<void>;
}
export type AuditSinkConfig = {
    type: "file";
    path?: string;
} | {
    type: "syslog";
    host: string;
    port?: number;
    protocol?: "udp" | "tcp";
    facility?: number;
    appName?: string;
} | {
    type: "http";
    url: string;
    headers?: Record<string, string>;
    method?: "POST" | "PUT";
    batchSize?: number;
    flushIntervalMs?: number;
} | {
    type: "azure-monitor";
    workspaceId: string;
    sharedKey: string;
    logType?: string;
    batchSize?: number;
    flushIntervalMs?: number;
} | {
    type: "cloudwatch";
    logGroupName: string;
    logStreamName?: string;
    region?: string;
    batchSize?: number;
    flushIntervalMs?: number;
};
export declare function createAuditSink(config: AuditSinkConfig): AuditSink;
//# sourceMappingURL=AuditSink.d.ts.map