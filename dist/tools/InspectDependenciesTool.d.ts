import { Tool } from "@modelcontextprotocol/sdk/types.js";
interface DependencyReference {
    name: string;
    schema: string;
    type: string;
    columns?: string[];
}
interface DependencyResult {
    success: boolean;
    object: string;
    objectType?: string;
    referencedBy?: {
        views: DependencyReference[];
        storedProcedures: DependencyReference[];
        functions: DependencyReference[];
        triggers: DependencyReference[];
        foreignKeys: {
            table: string;
            schema: string;
            column: string;
            constraint: string;
        }[];
    };
    references?: {
        tables: DependencyReference[];
        views: DependencyReference[];
        functions: DependencyReference[];
    };
    message?: string;
    error?: string;
    hint?: string;
}
export declare class InspectDependenciesTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    run(params: {
        objectName: string;
        includeColumns?: boolean;
        environment?: string;
        pool?: any;
    }): Promise<DependencyResult>;
}
export {};
//# sourceMappingURL=InspectDependenciesTool.d.ts.map