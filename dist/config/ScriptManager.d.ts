import { TierLevel } from "./EnvironmentManager.js";
export interface ScriptParameter {
    name: string;
    type: "string" | "number" | "boolean";
    required?: boolean;
    default?: string | number | boolean;
    description?: string;
}
export interface ScriptDefinition {
    name: string;
    description: string;
    file: string;
    parameters?: ScriptParameter[];
    allowedEnvironments?: string[];
    deniedEnvironments?: string[];
    tier?: TierLevel;
    requiresApproval?: boolean;
    readonly?: boolean;
}
export interface ScriptsManifest {
    scripts: ScriptDefinition[];
}
export interface LoadedScript extends ScriptDefinition {
    sql: string;
}
export declare class ScriptManager {
    private readonly scriptsPath;
    private readonly scripts;
    private loaded;
    constructor(scriptsPath?: string);
    /**
     * Load scripts from the configured path
     */
    private loadScripts;
    /**
     * Get all available scripts
     */
    listScripts(): LoadedScript[];
    /**
     * Get a specific script by name
     */
    getScript(name: string): LoadedScript | undefined;
    /**
     * Check if a script can run in a given environment
     */
    canRunInEnvironment(scriptName: string, environmentName: string): {
        allowed: boolean;
        reason?: string;
    };
    /**
     * Resolve script parameters into the SQL template
     * Parameters in SQL use @paramName syntax
     */
    resolveParameters(script: LoadedScript, providedParams: Record<string, any>): {
        sql: string;
        errors: string[];
    };
    /**
     * Get the scripts path (for display/debugging)
     */
    getScriptsPath(): string | null;
    /**
     * Check if scripts are configured
     */
    isConfigured(): boolean;
}
export declare function getScriptManager(scriptsPath?: string): ScriptManager;
export declare function initScriptManager(scriptsPath?: string): void;
//# sourceMappingURL=ScriptManager.d.ts.map