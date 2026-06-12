import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ExecuteTransactionTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<any>;
    private validateOperation;
    private executeOperation;
    private executeInsert;
    private executeUpdate;
    private executeDelete;
}
//# sourceMappingURL=ExecuteTransactionTool.d.ts.map