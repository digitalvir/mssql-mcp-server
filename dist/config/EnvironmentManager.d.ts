import sql from "mssql";
import { SecretResolver, SecretsConfig } from "./SecretResolver.js";
import type { AuditSinkConfig } from "../audit/sinks/AuditSink.js";
export type AccessLevel = "server" | "database";
export type TierLevel = "reader" | "writer" | "admin";
export type AuditLevel = "none" | "basic" | "verbose";
export interface EnvironmentConfig {
    name: string;
    description?: string;
    server: string;
    database: string;
    port?: number;
    authMode: "sql" | "windows" | "aad";
    username?: string;
    password?: string;
    domain?: string;
    trustServerCertificate?: boolean;
    connectionTimeout?: number;
    requestTimeout?: number;
    readonly?: boolean;
    allowedTools?: string[];
    deniedTools?: string[];
    maxRowsDefault?: number;
    requireApproval?: boolean;
    auditLevel?: AuditLevel;
    accessLevel?: AccessLevel;
    allowedDatabases?: string[] | "*";
    deniedDatabases?: string[];
    allowedSchemas?: string[];
    deniedSchemas?: string[];
    tier?: TierLevel;
    auditSinks?: AuditSinkConfig[];
}
export interface EnvironmentsConfig {
    defaultEnvironment?: string;
    environments: EnvironmentConfig[];
    scriptsPath?: string;
    secrets?: SecretsConfig;
    auditSinks?: AuditSinkConfig[];
}
export declare class EnvironmentManager {
    private readonly environments;
    private defaultEnvironment?;
    private readonly connections;
    private secretResolver;
    private refreshTimer?;
    private rawEnvironments?;
    private rawConfig?;
    private constructor();
    /**
     * Async factory method. Use this instead of `new EnvironmentManager()`.
     */
    static create(configPath?: string): Promise<EnvironmentManager>;
    getSecretResolver(): SecretResolver;
    /**
     * Get the raw environments config (before secret resolution).
     * Used by createMcpServer to read audit sink configurations.
     */
    getRawConfig(): EnvironmentsConfig | undefined;
    private loadFromFile;
    private loadFromEnvVars;
    getEnvironment(name?: string): EnvironmentConfig;
    listEnvironments(): EnvironmentConfig[];
    /**
     * Check if the environment allows access to a specific database.
     * For database-level access, only the configured database is allowed.
     * For server-level access, checks allowedDatabases/deniedDatabases.
     */
    isDatabaseAllowed(environmentName: string | undefined, databaseName: string): {
        allowed: boolean;
        reason?: string;
    };
    /**
     * Check if a schema.table reference is allowed based on allowedSchemas/deniedSchemas.
     * Pattern matching supports wildcards (e.g., "audit.*", "*.sensitive_*")
     */
    isSchemaAllowed(environmentName: string | undefined, schemaName: string, tableName?: string): {
        allowed: boolean;
        reason?: string;
    };
    /**
     * Simple wildcard pattern matching (supports * as wildcard)
     */
    private matchesPattern;
    getConnection(environmentName?: string): Promise<sql.ConnectionPool>;
    private createSqlConfig;
    /**
     * Start a background timer that periodically checks vault provider TTLs
     * and re-resolves environment configs when secrets change.
     */
    private startRefreshTimer;
    /**
     * Stop the background secret refresh timer.
     */
    stopRefreshTimer(): void;
    closeAll(): Promise<void>;
}
export declare function getEnvironmentManager(): Promise<EnvironmentManager>;
//# sourceMappingURL=EnvironmentManager.d.ts.map