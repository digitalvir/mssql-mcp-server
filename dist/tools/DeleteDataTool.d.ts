import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class DeleteDataTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    private static readonly MAX_ROWS_DEFAULT;
    run(params: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        affectedRows?: undefined;
        maxAllowed?: undefined;
        needsConfirmation?: undefined;
        preview?: undefined;
        rowsDeleted?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        affectedRows: number;
        maxAllowed?: undefined;
        needsConfirmation?: undefined;
        preview?: undefined;
        rowsDeleted?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        affectedRows: any;
        maxAllowed: any;
        needsConfirmation?: undefined;
        preview?: undefined;
        rowsDeleted?: undefined;
    } | {
        success: boolean;
        needsConfirmation: boolean;
        message: string;
        affectedRows: any;
        preview: sql.IRecordSet<any>;
        error: string;
        maxAllowed?: undefined;
        rowsDeleted?: undefined;
    } | {
        success: boolean;
        message: string;
        rowsDeleted: number;
        error?: undefined;
        affectedRows?: undefined;
        maxAllowed?: undefined;
        needsConfirmation?: undefined;
        preview?: undefined;
    }>;
}
//# sourceMappingURL=DeleteDataTool.d.ts.map