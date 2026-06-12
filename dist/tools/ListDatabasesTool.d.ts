import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ListDatabasesTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        environment?: undefined;
        accessLevel?: undefined;
        totalDatabases?: undefined;
        accessibleDatabases?: undefined;
        databases?: undefined;
    } | {
        success: boolean;
        message: string;
        environment: string;
        accessLevel: "server";
        totalDatabases: number;
        accessibleDatabases: number;
        databases: any[];
        error?: undefined;
    }>;
}
//# sourceMappingURL=ListDatabasesTool.d.ts.map