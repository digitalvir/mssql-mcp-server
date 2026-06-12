import type { AuditSink } from "./AuditSink.js";
import type { AuditLogEntry } from "../AuditLogger.js";
export interface SyslogSinkConfig {
    host: string;
    port?: number;
    protocol?: "udp" | "tcp";
    facility?: number;
    appName?: string;
}
export declare class SyslogSink implements AuditSink {
    readonly type = "syslog";
    private readonly host;
    private readonly port;
    private readonly protocol;
    private readonly facility;
    private readonly appName;
    private readonly hostname;
    private udpSocket;
    private tcpSocket;
    private tcpConnected;
    private tcpConnecting;
    private closed;
    constructor(config: SyslogSinkConfig);
    send(entry: AuditLogEntry): void;
    close(): Promise<void>;
    private sendUdp;
    private sendTcp;
    private connectTcp;
}
//# sourceMappingURL=SyslogSink.d.ts.map