import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ExplainQueryTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        hasPlanXml: boolean;
    } | {
        success: boolean;
        message: string;
        error: string;
    } | {
        planXml: string;
        success: boolean;
        message: string;
        hasPlanXml: boolean;
        error?: undefined;
    }>;
    private extractPlanXml;
}
//# sourceMappingURL=ExplainQueryTool.d.ts.map