import type { AuditLogEntry } from "../AuditLogger.js";
import type { AuditSink } from "./AuditSink.js";
export declare class FileSink implements AuditSink {
    readonly type = "file";
    private readonly logFilePath;
    constructor(filePath?: string);
    private ensureDirectory;
    send(entry: AuditLogEntry): void;
}
//# sourceMappingURL=FileSink.d.ts.map