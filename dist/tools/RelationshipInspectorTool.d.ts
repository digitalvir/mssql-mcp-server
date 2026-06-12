import { Tool } from "@modelcontextprotocol/sdk/types.js";
type RelationshipParams = {
    tableName: string;
    schemaName?: string;
    includeOutbound?: boolean;
    includeInbound?: boolean;
};
type ColumnMapping = {
    fromColumn: string;
    toColumn: string;
};
type Relationship = {
    constraintName: string;
    from: {
        schemaName: string;
        tableName: string;
    };
    to: {
        schemaName: string;
        tableName: string;
    };
    columnMapping: ColumnMapping[];
    updateRule: string;
    deleteRule: string;
};
type RelationshipResult = {
    success: boolean;
    message?: string;
    tableName?: string;
    schemaName?: string;
    outbound?: Relationship[];
    inbound?: Relationship[];
};
export declare class RelationshipInspectorTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    private normalizeBool;
    private ensureTableExists;
    private mapRelationships;
    private fetchRelationships;
    run(params: RelationshipParams): Promise<RelationshipResult>;
}
export {};
//# sourceMappingURL=RelationshipInspectorTool.d.ts.map