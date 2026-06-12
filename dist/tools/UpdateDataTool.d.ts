import sql from "mssql";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare class UpdateDataTool implements Tool {
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
        updates?: undefined;
        rowsAffected?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        affectedRows: number;
        maxAllowed?: undefined;
        needsConfirmation?: undefined;
        preview?: undefined;
        updates?: undefined;
        rowsAffected?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
        affectedRows: any;
        maxAllowed: any;
        needsConfirmation?: undefined;
        preview?: undefined;
        updates?: undefined;
        rowsAffected?: undefined;
    } | {
        success: boolean;
        needsConfirmation: boolean;
        message: string;
        affectedRows: any;
        preview: sql.IRecordSet<any>;
        updates: any;
        error: string;
        maxAllowed?: undefined;
        rowsAffected?: undefined;
    } | {
        success: boolean;
        message: string;
        rowsAffected: number;
        updates: any;
        error?: undefined;
        affectedRows?: undefined;
        maxAllowed?: undefined;
        needsConfirmation?: undefined;
        preview?: undefined;
    }>;
}
//# sourceMappingURL=UpdateDataTool.d.ts.map