import type { AuditSink } from "./AuditSink.js";
import type { AuditLogEntry } from "../AuditLogger.js";
export interface HttpSinkConfig {
    url: string;
    headers?: Record<string, string>;
    method?: string;
    batchSize?: number;
    flushIntervalMs?: number;
}
export declare class HttpSink implements AuditSink {
    readonly type = "http";
    private readonly url;
    private readonly headers;
    private readonly method;
    private readonly batchSize;
    private readonly flushIntervalMs;
    private buffer;
    private timer;
    private closed;
    constructor(config: HttpSinkConfig);
    send(entry: AuditLogEntry): void;
    flush(): Promise<void>;
    close(): Promise<void>;
    private post;
}
//# sourceMappingURL=HttpSink.d.ts.map