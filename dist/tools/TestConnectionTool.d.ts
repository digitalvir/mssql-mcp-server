import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class TestConnectionTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        connected: boolean;
        mcpServerVersion: any;
        latency: {
            connectionMs: number;
            queryMs: number;
            totalMs: number;
        };
        serverInfo: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        connected: boolean;
        latency: {
            totalMs: number;
            connectionMs?: undefined;
            queryMs?: undefined;
        };
        error: {
            code: string;
            suggestion: string;
        };
        mcpServerVersion?: undefined;
        serverInfo?: undefined;
    }>;
    private getEngineEditionName;
    private categorizeError;
}
//# sourceMappingURL=TestConnectionTool.d.ts.map