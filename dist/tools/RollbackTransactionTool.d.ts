import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class RollbackTransactionTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        environment?: undefined;
        operationCount?: undefined;
    } | {
        success: boolean;
        message: string;
        environment: any;
        operationCount: any;
        error?: undefined;
    }>;
}
//# sourceMappingURL=RollbackTransactionTool.d.ts.map