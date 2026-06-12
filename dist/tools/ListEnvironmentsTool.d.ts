import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ListEnvironmentsTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        defaultEnvironment: string | null;
        environmentCount: number;
        environments: ({
            name: string;
            description: string | null;
            server: string;
            database: string;
            accessLevel: import("../config/EnvironmentManager.js").AccessLevel;
            readonly: boolean;
            tier: import("../config/EnvironmentManager.js").TierLevel | null;
        } | {
            authMode: "sql" | "windows" | "aad";
            port: number;
            allowedTools: string[] | null;
            deniedTools: string[] | null;
            allowedDatabases: string[] | "*" | null;
            deniedDatabases: string[] | null;
            allowedSchemas: string[] | null;
            deniedSchemas: string[] | null;
            maxRowsDefault: number | null;
            requireApproval: boolean;
            name: string;
            description: string | null;
            server: string;
            database: string;
            accessLevel: import("../config/EnvironmentManager.js").AccessLevel;
            readonly: boolean;
            tier: import("../config/EnvironmentManager.js").TierLevel | null;
        })[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        defaultEnvironment?: undefined;
        environmentCount?: undefined;
        environments?: undefined;
    }>;
}
//# sourceMappingURL=ListEnvironmentsTool.d.ts.map