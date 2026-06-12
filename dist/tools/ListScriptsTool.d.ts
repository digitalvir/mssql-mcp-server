import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ListScriptsTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params?: {
        environment?: string;
        tier?: string;
    }): Promise<{
        success: boolean;
        message: string;
        scriptsPath: string | null;
        scripts: never[];
        totalScripts?: undefined;
        filteredCount?: undefined;
    } | {
        success: boolean;
        scriptsPath: string | null;
        totalScripts: number;
        filteredCount: number;
        scripts: {
            name: string;
            description: string;
            parameters: {
                name: string;
                type: "string" | "number" | "boolean";
                required: boolean;
                default: string | number | boolean | undefined;
                description: string | undefined;
            }[] | undefined;
            tier: import("../index.js").ConfigTierLevel | undefined;
            requiresApproval: boolean | undefined;
            readonly: boolean | undefined;
            allowedEnvironments: string[] | undefined;
            deniedEnvironments: string[] | undefined;
        }[];
        message?: undefined;
    }>;
}
//# sourceMappingURL=ListScriptsTool.d.ts.map