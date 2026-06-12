import * as fs from "fs";
import * as path from "path";
export class ScriptManager {
    constructor(scriptsPath) {
        this.scripts = new Map();
        this.loaded = false;
        if (scriptsPath) {
            this.scriptsPath = path.resolve(scriptsPath);
        }
        else if (process.env.SCRIPTS_PATH) {
            this.scriptsPath = path.resolve(process.env.SCRIPTS_PATH);
        }
        else {
            this.scriptsPath = null;
        }
    }
    /**
     * Load scripts from the configured path
     */
    loadScripts() {
        if (this.loaded)
            return;
        this.loaded = true;
        if (!this.scriptsPath) {
            return;
        }
        if (!fs.existsSync(this.scriptsPath)) {
            console.warn(`Scripts path not found: ${this.scriptsPath}`);
            return;
        }
        const manifestPath = path.join(this.scriptsPath, "scripts.json");
        if (!fs.existsSync(manifestPath)) {
            console.warn(`Scripts manifest not found: ${manifestPath}`);
            return;
        }
        try {
            const manifestContent = fs.readFileSync(manifestPath, "utf-8");
            const manifest = JSON.parse(manifestContent);
            for (const script of manifest.scripts) {
                const sqlPath = path.join(this.scriptsPath, script.file);
                if (!fs.existsSync(sqlPath)) {
                    console.warn(`Script file not found: ${sqlPath}`);
                    continue;
                }
                const sql = fs.readFileSync(sqlPath, "utf-8");
                this.scripts.set(script.name, {
                    ...script,
                    sql,
                });
            }
            console.error(`Loaded ${this.scripts.size} named script(s) from ${this.scriptsPath}`);
        }
        catch (error) {
            console.error(`Failed to load scripts manifest: ${error}`);
        }
    }
    /**
     * Get all available scripts
     */
    listScripts() {
        this.loadScripts();
        return Array.from(this.scripts.values());
    }
    /**
     * Get a specific script by name
     */
    getScript(name) {
        this.loadScripts();
        return this.scripts.get(name);
    }
    /**
     * Check if a script can run in a given environment
     */
    canRunInEnvironment(scriptName, environmentName) {
        const script = this.getScript(scriptName);
        if (!script) {
            return { allowed: false, reason: `Script '${scriptName}' not found` };
        }
        // Check denied environments first
        if (script.deniedEnvironments && script.deniedEnvironments.includes(environmentName)) {
            return {
                allowed: false,
                reason: `Script '${scriptName}' is not allowed in environment '${environmentName}'`
            };
        }
        // Check allowed environments if specified
        if (script.allowedEnvironments && script.allowedEnvironments.length > 0) {
            if (!script.allowedEnvironments.includes(environmentName)) {
                return {
                    allowed: false,
                    reason: `Script '${scriptName}' can only run in: ${script.allowedEnvironments.join(", ")}`
                };
            }
        }
        return { allowed: true };
    }
    /**
     * Resolve script parameters into the SQL template
     * Parameters in SQL use @paramName syntax
     */
    resolveParameters(script, providedParams) {
        const errors = [];
        let sql = script.sql;
        // Build final parameter values with defaults
        const resolvedParams = {};
        for (const param of script.parameters || []) {
            if (providedParams[param.name] !== undefined) {
                resolvedParams[param.name] = providedParams[param.name];
            }
            else if (param.default !== undefined) {
                resolvedParams[param.name] = param.default;
            }
            else if (param.required) {
                errors.push(`Required parameter '${param.name}' not provided`);
            }
        }
        if (errors.length > 0) {
            return { sql, errors };
        }
        // Replace @paramName with actual values
        // Note: This is for preview purposes. Actual execution should use parameterized queries.
        for (const [name, value] of Object.entries(resolvedParams)) {
            const placeholder = new RegExp(`@${name}\\b`, "g");
            let replacement;
            if (typeof value === "string") {
                // Escape single quotes for SQL
                replacement = `'${value.replace(/'/g, "''")}'`;
            }
            else if (typeof value === "boolean") {
                replacement = value ? "1" : "0";
            }
            else if (value === null) {
                replacement = "NULL";
            }
            else {
                replacement = String(value);
            }
            sql = sql.replace(placeholder, replacement);
        }
        return { sql, errors: [] };
    }
    /**
     * Get the scripts path (for display/debugging)
     */
    getScriptsPath() {
        return this.scriptsPath;
    }
    /**
     * Check if scripts are configured
     */
    isConfigured() {
        return this.scriptsPath !== null;
    }
}
// Singleton instance
let scriptManagerInstance = null;
export function getScriptManager(scriptsPath) {
    if (!scriptManagerInstance) {
        scriptManagerInstance = new ScriptManager(scriptsPath);
    }
    return scriptManagerInstance;
}
export function initScriptManager(scriptsPath) {
    scriptManagerInstance = new ScriptManager(scriptsPath);
}
//# sourceMappingURL=ScriptManager.js.map