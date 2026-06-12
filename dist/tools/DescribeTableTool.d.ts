import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class DescribeTableTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: {
        tableName: string;
        database?: string;
        environment?: string;
    }): Promise<{
        success: boolean;
        message: string;
        error: string;
        database?: undefined;
        schema?: undefined;
        tableName?: undefined;
        columnCount?: undefined;
        columns?: undefined;
    } | {
        success: boolean;
        message: string;
        database: string | undefined;
        schema: string;
        tableName: string;
        columnCount: number;
        columns: sql.IRecordSet<any>;
        error?: undefined;
    }>;
}
//# sourceMappingURL=DescribeTableTool.d.ts.map