import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class BeginTransactionTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        environment?: undefined;
        hint?: undefined;
    } | {
        success: boolean;
        message: string;
        environment: any;
        hint: string;
        error?: undefined;
    }>;
}
//# sourceMappingURL=BeginTransactionTool.d.ts.map