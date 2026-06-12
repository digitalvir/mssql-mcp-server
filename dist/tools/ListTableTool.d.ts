import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class ListTableTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        database?: undefined;
        tableCount?: undefined;
        tables?: undefined;
    } | {
        success: boolean;
        message: string;
        database: any;
        tableCount: number;
        tables: sql.IRecordSet<any>;
        error?: undefined;
    }>;
}
//# sourceMappingURL=ListTableTool.d.ts.map