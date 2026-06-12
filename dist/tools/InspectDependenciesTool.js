import sql from "mssql";
export class InspectDependenciesTool {
    constructor() {
        this.name = "inspect_dependencies";
        this.description = "Shows what database objects depend on a table, view, or other object. Use for impact analysis before schema changes.";
        this.inputSchema = {
            type: "object",
            properties: {
                objectName: {
                    type: "string",
                    description: "Name of the object to inspect (e.g., 'dbo.Customers' or 'Customers')",
                },
                includeColumns: {
                    type: "boolean",
                    description: "Include column-level dependency details. Default: false",
                },
                environment: {
                    type: "string",
                    description: "Optional environment name to target.",
                },
            },
            required: ["objectName"],
        };
    }
    async run(params) {
        const { objectName, includeColumns = false } = params;
        try {
            // Parse schema and object name
            const parts = objectName.split(".");
            let schemaName = "dbo";
            let objName = objectName;
            if (parts.length === 2) {
                schemaName = parts[0];
                objName = parts[1];
            }
            const pool = params.pool;
            if (!pool) {
                return {
                    success: false,
                    object: objectName,
                    error: "NO_CONNECTION",
                    message: "No database connection available.",
                };
            }
            // First, get the object type
            const objectTypeResult = await pool.request()
                .input("schema", sql.NVarChar, schemaName)
                .input("name", sql.NVarChar, objName)
                .query(`
          SELECT
            o.type_desc AS objectType,
            o.object_id AS objectId
          FROM sys.objects o
          INNER JOIN sys.schemas s ON o.schema_id = s.schema_id
          WHERE s.name = @schema AND o.name = @name
        `);
            if (objectTypeResult.recordset.length === 0) {
                return {
                    success: false,
                    object: objectName,
                    error: "OBJECT_NOT_FOUND",
                    message: `Object '${schemaName}.${objName}' not found.`,
                };
            }
            const objectType = objectTypeResult.recordset[0].objectType;
            const objectId = objectTypeResult.recordset[0].objectId;
            // Get objects that reference this object (what depends on this)
            const referencedByResult = await pool.request()
                .input("schema", sql.NVarChar, schemaName)
                .input("name", sql.NVarChar, objName)
                .query(`
          SELECT DISTINCT
            OBJECT_SCHEMA_NAME(d.referencing_id) AS referencingSchema,
            OBJECT_NAME(d.referencing_id) AS referencingName,
            o.type_desc AS referencingType
          FROM sys.sql_expression_dependencies d
          INNER JOIN sys.objects o ON d.referencing_id = o.object_id
          WHERE d.referenced_schema_name = @schema
            AND d.referenced_entity_name = @name
            AND d.referencing_id != d.referenced_id
          ORDER BY o.type_desc, referencingName
        `);
            // Get foreign keys pointing to this table (if it's a table)
            let foreignKeys = [];
            if (objectType === "USER_TABLE") {
                const fkResult = await pool.request()
                    .input("objectId", sql.Int, objectId)
                    .query(`
            SELECT
              OBJECT_SCHEMA_NAME(fk.parent_object_id) AS referencingSchema,
              OBJECT_NAME(fk.parent_object_id) AS referencingTable,
              COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS referencingColumn,
              fk.name AS constraintName
            FROM sys.foreign_keys fk
            INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
            WHERE fk.referenced_object_id = @objectId
            ORDER BY referencingTable, referencingColumn
          `);
                foreignKeys = fkResult.recordset;
            }
            // Get objects that this object references (what this depends on)
            const referencesResult = await pool.request()
                .input("schema", sql.NVarChar, schemaName)
                .input("name", sql.NVarChar, objName)
                .query(`
          SELECT DISTINCT
            d.referenced_schema_name AS referencedSchema,
            d.referenced_entity_name AS referencedName,
            COALESCE(o.type_desc, 'UNKNOWN') AS referencedType
          FROM sys.sql_expression_dependencies d
          LEFT JOIN sys.objects o ON d.referenced_id = o.object_id
          WHERE OBJECT_SCHEMA_NAME(d.referencing_id) = @schema
            AND OBJECT_NAME(d.referencing_id) = @name
            AND d.referenced_entity_name IS NOT NULL
          ORDER BY referencedType, referencedName
        `);
            // Categorize referencing objects
            const views = [];
            const storedProcedures = [];
            const functions = [];
            const triggers = [];
            for (const row of referencedByResult.recordset) {
                const ref = {
                    name: row.referencingName,
                    schema: row.referencingSchema,
                    type: row.referencingType,
                };
                switch (row.referencingType) {
                    case "VIEW":
                        views.push(ref);
                        break;
                    case "SQL_STORED_PROCEDURE":
                        storedProcedures.push(ref);
                        break;
                    case "SQL_SCALAR_FUNCTION":
                    case "SQL_TABLE_VALUED_FUNCTION":
                    case "SQL_INLINE_TABLE_VALUED_FUNCTION":
                        functions.push(ref);
                        break;
                    case "SQL_TRIGGER":
                        triggers.push(ref);
                        break;
                    default:
                        // Other types go to functions as catch-all
                        functions.push(ref);
                }
            }
            // Categorize referenced objects
            const referencedTables = [];
            const referencedViews = [];
            const referencedFunctions = [];
            for (const row of referencesResult.recordset) {
                const ref = {
                    name: row.referencedName,
                    schema: row.referencedSchema || "dbo",
                    type: row.referencedType,
                };
                switch (row.referencedType) {
                    case "USER_TABLE":
                        referencedTables.push(ref);
                        break;
                    case "VIEW":
                        referencedViews.push(ref);
                        break;
                    default:
                        referencedFunctions.push(ref);
                }
            }
            const result = {
                success: true,
                object: `${schemaName}.${objName}`,
                objectType,
                referencedBy: {
                    views,
                    storedProcedures,
                    functions,
                    triggers,
                    foreignKeys: foreignKeys.map((fk) => ({
                        table: fk.referencingTable,
                        schema: fk.referencingSchema,
                        column: fk.referencingColumn,
                        constraint: fk.constraintName,
                    })),
                },
                references: {
                    tables: referencedTables,
                    views: referencedViews,
                    functions: referencedFunctions,
                },
            };
            // Add summary counts
            const totalReferencedBy = views.length +
                storedProcedures.length +
                functions.length +
                triggers.length +
                foreignKeys.length;
            const totalReferences = referencedTables.length + referencedViews.length + referencedFunctions.length;
            if (totalReferencedBy === 0 && totalReferences === 0) {
                result.message = `No dependencies found for '${schemaName}.${objName}'.`;
            }
            else {
                result.message = `Found ${totalReferencedBy} object(s) that reference this ${objectType.toLowerCase().replace(/_/g, " ")}, and ${totalReferences} object(s) that it references.`;
            }
            if (totalReferencedBy > 0) {
                result.hint = "Modifying or dropping this object may affect the listed dependents.";
            }
            return result;
        }
        catch (error) {
            return {
                success: false,
                object: objectName,
                error: "QUERY_ERROR",
                message: `Failed to inspect dependencies: ${error.message}`,
            };
        }
    }
}
//# sourceMappingURL=InspectDependenciesTool.js.map