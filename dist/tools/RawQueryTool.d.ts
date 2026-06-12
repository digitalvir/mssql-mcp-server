import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class RawQueryTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        database?: undefined;
        data?: undefined;
        recordsets?: undefined;
        rowsAffected?: undefined;
        recordCount?: undefined;
    } | {
        success: boolean;
        message: string;
        database: any;
        data: sql.IRecordSet<any>;
        recordsets: any[];
        rowsAffected: number[];
        recordCount: number;
        error?: undefined;
    }>;
}
//# sourceMappingURL=RawQueryTool.d.ts.map