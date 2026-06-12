import type { RunnableTool, ToolRoutingConfig } from "../types.js";
export declare function createAllToolInstances(): {
    beginTransactionTool: RunnableTool;
    commitTransactionTool: RunnableTool;
    createIndexTool: RunnableTool;
    createTableTool: RunnableTool;
    deleteDataTool: RunnableTool;
    describeTableTool: RunnableTool;
    dropTableTool: RunnableTool;
    executeTransactionTool: RunnableTool;
    explainQueryTool: RunnableTool;
    insertDataTool: RunnableTool;
    inspectDependenciesTool: RunnableTool;
    listDatabasesTool: RunnableTool;
    listEnvironmentsTool: RunnableTool;
    listScriptsTool: RunnableTool;
    listTableTool: RunnableTool;
    profileTableTool: RunnableTool;
    rawQueryTool: RunnableTool;
    readDataTool: RunnableTool;
    relationshipInspectorTool: RunnableTool;
    rollbackTransactionTool: RunnableTool;
    runScriptTool: RunnableTool;
    searchSchemaTool: RunnableTool;
    testConnectionTool: RunnableTool;
    updateDataTool: RunnableTool;
    validateEnvironmentConfigTool: RunnableTool;
};
type AllTools = ReturnType<typeof createAllToolInstances>;
/** 14 read-only tools exposed by the reader tier */
export declare function getReaderTools(t: AllTools): RunnableTool[];
/** 17 tools: reader tools + insert/delete/update */
export declare function getWriterTools(t: AllTools): RunnableTool[];
/** 12 curated tools: read-only discovery/diagnostics + raw_query escape hatch */
export declare function getAdminTools(t: AllTools): RunnableTool[];
/** Explicit mode: begin/commit/rollback tools */
export declare function getExplicitTransactionTools(t: AllTools): RunnableTool[];
/** Batch mode: single execute_transaction tool */
export declare function getBatchTransactionTools(t: AllTools): RunnableTool[];
/** Reader: no mutations */
export declare const READER_MUTATING_TOOLS: Set<string>;
/** Writer: data mutation only */
export declare const WRITER_MUTATING_TOOLS: Set<string>;
/** Admin/server: data mutation + DDL */
export declare const ADMIN_MUTATING_TOOLS: Set<string>;
export declare const READER_APPROVAL_EXEMPT: Set<string>;
export declare const WRITER_APPROVAL_EXEMPT: Set<string>;
export declare const ADMIN_APPROVAL_EXEMPT: Set<string>;
export declare function buildToolRegistry(t: AllTools): ToolRoutingConfig[];
export {};
//# sourceMappingURL=toolsets.d.ts.map