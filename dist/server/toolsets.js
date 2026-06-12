import { BeginTransactionTool } from "../tools/BeginTransactionTool.js";
import { CommitTransactionTool } from "../tools/CommitTransactionTool.js";
import { CreateIndexTool } from "../tools/CreateIndexTool.js";
import { CreateTableTool } from "../tools/CreateTableTool.js";
import { DeleteDataTool } from "../tools/DeleteDataTool.js";
import { DescribeTableTool } from "../tools/DescribeTableTool.js";
import { DropTableTool } from "../tools/DropTableTool.js";
import { ExecuteTransactionTool } from "../tools/ExecuteTransactionTool.js";
import { ExplainQueryTool } from "../tools/ExplainQueryTool.js";
import { InsertDataTool } from "../tools/InsertDataTool.js";
import { InspectDependenciesTool } from "../tools/InspectDependenciesTool.js";
import { ListDatabasesTool } from "../tools/ListDatabasesTool.js";
import { ListEnvironmentsTool } from "../tools/ListEnvironmentsTool.js";
import { ListScriptsTool } from "../tools/ListScriptsTool.js";
import { ListTableTool } from "../tools/ListTableTool.js";
import { ProfileTableTool } from "../tools/ProfileTableTool.js";
import { RawQueryTool } from "../tools/RawQueryTool.js";
import { ReadDataTool } from "../tools/ReadDataTool.js";
import { RelationshipInspectorTool } from "../tools/RelationshipInspectorTool.js";
import { RollbackTransactionTool } from "../tools/RollbackTransactionTool.js";
import { RunScriptTool } from "../tools/RunScriptTool.js";
import { SearchSchemaTool } from "../tools/SearchSchemaTool.js";
import { TestConnectionTool } from "../tools/TestConnectionTool.js";
import { UpdateDataTool } from "../tools/UpdateDataTool.js";
import { ValidateEnvironmentConfigTool } from "../tools/ValidateEnvironmentConfigTool.js";
// ─── Tool instances ─────────────────────────────────────────────────────────
export function createAllToolInstances() {
    return {
        beginTransactionTool: new BeginTransactionTool(),
        commitTransactionTool: new CommitTransactionTool(),
        createIndexTool: new CreateIndexTool(),
        createTableTool: new CreateTableTool(),
        deleteDataTool: new DeleteDataTool(),
        describeTableTool: new DescribeTableTool(),
        dropTableTool: new DropTableTool(),
        executeTransactionTool: new ExecuteTransactionTool(),
        explainQueryTool: new ExplainQueryTool(),
        insertDataTool: new InsertDataTool(),
        inspectDependenciesTool: new InspectDependenciesTool(),
        listDatabasesTool: new ListDatabasesTool(),
        listEnvironmentsTool: new ListEnvironmentsTool(),
        listScriptsTool: new ListScriptsTool(),
        listTableTool: new ListTableTool(),
        profileTableTool: new ProfileTableTool(),
        rawQueryTool: new RawQueryTool(),
        readDataTool: new ReadDataTool(),
        relationshipInspectorTool: new RelationshipInspectorTool(),
        rollbackTransactionTool: new RollbackTransactionTool(),
        runScriptTool: new RunScriptTool(),
        searchSchemaTool: new SearchSchemaTool(),
        testConnectionTool: new TestConnectionTool(),
        updateDataTool: new UpdateDataTool(),
        validateEnvironmentConfigTool: new ValidateEnvironmentConfigTool(),
    };
}
// ─── Tier-based tool lists ──────────────────────────────────────────────────
/** 14 read-only tools exposed by the reader tier */
export function getReaderTools(t) {
    return [
        t.readDataTool,
        t.listTableTool,
        t.listDatabasesTool,
        t.listEnvironmentsTool,
        t.validateEnvironmentConfigTool,
        t.listScriptsTool,
        t.runScriptTool,
        t.describeTableTool,
        t.searchSchemaTool,
        t.profileTableTool,
        t.relationshipInspectorTool,
        t.inspectDependenciesTool,
        t.testConnectionTool,
        t.explainQueryTool,
    ];
}
/** 17 tools: reader tools + insert/delete/update */
export function getWriterTools(t) {
    return [
        ...getReaderTools(t),
        t.insertDataTool,
        t.deleteDataTool,
        t.updateDataTool,
    ];
}
/** 12 curated tools: read-only discovery/diagnostics + raw_query escape hatch */
export function getAdminTools(t) {
    return [
        t.readDataTool,
        t.rawQueryTool,
        t.listTableTool,
        t.listDatabasesTool,
        t.listEnvironmentsTool,
        t.describeTableTool,
        t.searchSchemaTool,
        t.profileTableTool,
        t.relationshipInspectorTool,
        t.inspectDependenciesTool,
        t.testConnectionTool,
        t.explainQueryTool,
    ];
}
// ─── Transaction tool lists ────────────────────────────────────────────────
/** Explicit mode: begin/commit/rollback tools */
export function getExplicitTransactionTools(t) {
    return [
        t.beginTransactionTool,
        t.commitTransactionTool,
        t.rollbackTransactionTool,
    ];
}
/** Batch mode: single execute_transaction tool */
export function getBatchTransactionTools(t) {
    return [t.executeTransactionTool];
}
// ─── Mutating tool sets per tier ────────────────────────────────────────────
/** Reader: no mutations */
export const READER_MUTATING_TOOLS = new Set();
/** Writer: data mutation only */
export const WRITER_MUTATING_TOOLS = new Set([
    "insert_data",
    "delete_data",
    "update_data",
    "begin_transaction",
    "commit_transaction",
    "rollback_transaction",
    "execute_transaction",
]);
/** Admin/server: data mutation + DDL */
export const ADMIN_MUTATING_TOOLS = new Set([
    "insert_data",
    "delete_data",
    "update_data",
    "create_table",
    "create_index",
    "drop_table",
    "raw_query",
    "begin_transaction",
    "commit_transaction",
    "rollback_transaction",
    "execute_transaction",
]);
// ─── Approval-exempt tools (read-only, no data modification) ────────────────
export const READER_APPROVAL_EXEMPT = new Set([
    "list_tables",
    "list_databases",
    "list_environments",
    "validate_environment_config",
    "list_scripts",
    "describe_table",
    "test_connection",
    "search_schema",
    "inspect_relationships",
    "inspect_dependencies",
    "read_data",
    "profile_table",
    "explain_query",
    "run_script",
]);
export const WRITER_APPROVAL_EXEMPT = new Set([
    "list_tables",
    "list_databases",
    "list_environments",
    "validate_environment_config",
    "list_scripts",
    "describe_table",
    "test_connection",
    "search_schema",
    "inspect_relationships",
    "inspect_dependencies",
]);
export const ADMIN_APPROVAL_EXEMPT = new Set([
    "list_tables",
    "list_databases",
    "list_environments",
    "validate_environment_config",
    "list_scripts",
    "describe_table",
    "test_connection",
    "search_schema",
    "inspect_relationships",
    "inspect_dependencies",
    "read_data",
    "profile_table",
    "explain_query",
]);
// ─── Routing registry builder ───────────────────────────────────────────────
export function buildToolRegistry(t) {
    return [
        {
            tool: t.readDataTool,
            name: t.readDataTool.name,
            intents: ["data_read"],
            keywords: ["select", "query", "fetch", "report", "count"],
            requiredArgs: ["query"],
            baseScore: 2,
        },
        {
            tool: t.rawQueryTool,
            name: t.rawQueryTool.name,
            intents: ["data_read", "data_write", "schema_change"],
            keywords: ["exec", "execute", "raw", "stored procedure", "proc", "any sql"],
            requiredArgs: ["query"],
            mutatesData: true,
        },
        {
            tool: t.listTableTool,
            name: t.listTableTool.name,
            intents: ["schema_discovery"],
            keywords: ["list tables", "show tables", "tables"],
            baseScore: 1.5,
        },
        {
            tool: t.describeTableTool,
            name: t.describeTableTool.name,
            intents: ["schema_discovery"],
            keywords: ["describe", "columns", "structure"],
            requiredArgs: ["tableName"],
            baseScore: 1.5,
        },
        {
            tool: t.searchSchemaTool,
            name: t.searchSchemaTool.name,
            intents: ["schema_discovery"],
            keywords: ["search", "find", "look up"],
            baseScore: 1.5,
        },
        {
            tool: t.profileTableTool,
            name: t.profileTableTool.name,
            intents: ["metadata"],
            keywords: ["profile", "sample", "distribution"],
            requiredArgs: ["tableName"],
        },
        {
            tool: t.relationshipInspectorTool,
            name: t.relationshipInspectorTool.name,
            intents: ["metadata", "schema_discovery"],
            keywords: ["relationships", "foreign key", "references"],
            requiredArgs: ["tableName"],
        },
        {
            tool: t.insertDataTool,
            name: t.insertDataTool.name,
            intents: ["data_write"],
            keywords: ["insert", "add", "create record"],
            requiredArgs: ["tableName", "data"],
            mutatesData: true,
        },
        {
            tool: t.deleteDataTool,
            name: t.deleteDataTool.name,
            intents: ["data_write"],
            keywords: ["delete", "remove", "purge"],
            requiredArgs: ["tableName", "whereClause"],
            mutatesData: true,
        },
        {
            tool: t.updateDataTool,
            name: t.updateDataTool.name,
            intents: ["data_write"],
            keywords: ["update", "modify", "fix"],
            requiredArgs: ["tableName", "updates", "whereClause"],
            mutatesData: true,
        },
        {
            tool: t.createTableTool,
            name: t.createTableTool.name,
            intents: ["schema_change"],
            keywords: ["create table", "new table"],
            requiredArgs: ["tableName", "columns"],
            schemaChange: true,
        },
        {
            tool: t.createIndexTool,
            name: t.createIndexTool.name,
            intents: ["schema_change"],
            keywords: ["create index", "add index"],
            requiredArgs: ["tableName", "columns", "indexName"],
            schemaChange: true,
        },
        {
            tool: t.dropTableTool,
            name: t.dropTableTool.name,
            intents: ["schema_change"],
            keywords: ["drop table", "remove table", "delete table"],
            requiredArgs: ["tableName"],
            schemaChange: true,
            mutatesData: true,
        },
        {
            tool: t.testConnectionTool,
            name: t.testConnectionTool.name,
            intents: ["metadata"],
            keywords: ["test", "connection", "ping", "health"],
            baseScore: 1,
        },
        {
            tool: t.explainQueryTool,
            name: t.explainQueryTool.name,
            intents: ["metadata"],
            keywords: ["plan", "explain", "showplan", "estimate"],
            requiredArgs: ["query"],
            baseScore: 1,
        },
        {
            tool: t.listDatabasesTool,
            name: t.listDatabasesTool.name,
            intents: ["schema_discovery", "metadata"],
            keywords: ["databases", "list databases", "show databases", "dbs"],
            baseScore: 1.5,
        },
        {
            tool: t.listEnvironmentsTool,
            name: t.listEnvironmentsTool.name,
            intents: ["metadata"],
            keywords: ["environments", "list environments", "connections", "configs"],
            baseScore: 1.5,
        },
        {
            tool: t.validateEnvironmentConfigTool,
            name: t.validateEnvironmentConfigTool.name,
            intents: ["metadata"],
            keywords: ["validate", "check", "config", "configuration", "health"],
            baseScore: 1.5,
        },
        {
            tool: t.listScriptsTool,
            name: t.listScriptsTool.name,
            intents: ["metadata"],
            keywords: ["scripts", "list scripts", "templates", "named scripts"],
            baseScore: 1.5,
        },
        {
            tool: t.runScriptTool,
            name: t.runScriptTool.name,
            intents: ["data_read", "data_write"],
            keywords: ["run script", "execute script", "template"],
            requiredArgs: ["scriptName"],
            baseScore: 1.5,
        },
        {
            tool: t.inspectDependenciesTool,
            name: t.inspectDependenciesTool.name,
            intents: ["schema_discovery", "metadata"],
            keywords: ["dependencies", "depends", "references", "impact", "what uses"],
            requiredArgs: ["objectName"],
            baseScore: 1.5,
        },
    ];
}
//# sourceMappingURL=toolsets.js.map