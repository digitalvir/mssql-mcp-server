import { FileSink } from "./FileSink.js";
import { SyslogSink } from "./SyslogSink.js";
import { HttpSink } from "./HttpSink.js";
import { AzureMonitorSink } from "./AzureMonitorSink.js";
import { CloudWatchSink } from "./CloudWatchSink.js";
export function createAuditSink(config) {
    switch (config.type) {
        case "file":
            return new FileSink(config.path);
        case "syslog":
            return new SyslogSink(config);
        case "http":
            return new HttpSink(config);
        case "azure-monitor":
            return new AzureMonitorSink(config);
        case "cloudwatch":
            return new CloudWatchSink(config);
        default:
            throw new Error(`Unknown audit sink type: ${config.type}`);
    }
}
//# sourceMappingURL=AuditSink.js.map