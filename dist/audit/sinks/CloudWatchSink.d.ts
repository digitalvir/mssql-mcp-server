import type { AuditSink } from "./AuditSink.js";
import type { AuditLogEntry } from "../AuditLogger.js";
export interface CloudWatchSinkConfig {
    logGroupName: string;
    logStreamName?: string;
    region?: string;
    batchSize?: number;
    flushIntervalMs?: number;
}
export declare class CloudWatchSink implements AuditSink {
    readonly type = "cloudwatch";
    private readonly logGroupName;
    private readonly logStreamName;
    private readonly region?;
    private readonly batchSize;
    private readonly flushIntervalMs;
    private buffer;
    private timer;
    private client;
    private sequenceToken;
    private initialized;
    private disabled;
    constructor(config: CloudWatchSinkConfig);
    send(entry: AuditLogEntry): void;
    flush(): Promise<void>;
    close(): Promise<void>;
    private initClient;
    private ensureLogGroupAndStream;
    private refreshSequenceToken;
    private putLogEvents;
}
//# sourceMappingURL=CloudWatchSink.d.ts.map