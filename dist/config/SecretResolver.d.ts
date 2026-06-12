export interface SecretProvider {
    type: string;
    resolve(name: string): string | undefined;
    initialize?(): Promise<void>;
    /** Re-fetch secrets from the backing store. Returns true if any values changed. */
    refresh?(): Promise<boolean>;
    /** TTL in seconds. If set, the provider's cache expires after this duration. */
    ttlSeconds?: number;
    /** Timestamp of last successful initialization or refresh. */
    lastRefreshedAt?: number;
}
export interface SecretProviderConfig {
    type: string;
    path?: string;
    directory?: string;
    vaultUrl?: string;
    region?: string;
    address?: string;
    token?: string;
    vaultPath?: string;
    secrets?: string[];
    ttlSeconds?: number;
    [key: string]: any;
}
export interface SecretsConfig {
    providers: SecretProviderConfig[];
}
/**
 * Resolves ${secret:NAME} placeholders by querying an ordered list of providers.
 * First provider to return a value wins.
 */
export declare class SecretResolver {
    private readonly providers;
    constructor(providers: SecretProvider[]);
    /**
     * Resolve a single secret by name, trying each provider in order.
     */
    resolve(name: string): string | undefined;
    /**
     * Replace all ${secret:NAME} placeholders in a string.
     */
    resolveString(value: string | undefined): string | undefined;
    /**
     * Recursively resolve secret placeholders in all string values of an object.
     */
    resolveObject<T extends Record<string, any>>(config: T): T;
    /**
     * Extract all ${secret:NAME} references from a string.
     */
    static extractSecretNames(value: string): string[];
    /**
     * Check which secret names are resolvable and which are not.
     */
    checkResolvability(names: string[]): {
        resolved: string[];
        unresolved: string[];
    };
    /**
     * Refresh any providers whose TTL has expired.
     * Returns true if any secret values changed (callers should re-resolve configs).
     */
    refreshProviders(): Promise<boolean>;
    /**
     * Returns the shortest TTL among all providers that have one, or undefined if none.
     */
    get shortestTtlSeconds(): number | undefined;
    get providerCount(): number;
    get providerTypes(): string[];
}
/**
 * Create a SecretResolver from configuration.
 * Defaults to [{ type: "env" }] if no config provided.
 * Now async to support vault providers that need initialization.
 */
export declare function createSecretResolver(config?: SecretsConfig): Promise<SecretResolver>;
/**
 * Check if a dotenv provider config points to a readable file.
 */
export declare function validateDotenvPath(filePath: string): {
    valid: boolean;
    error?: string;
};
/**
 * Check if a file provider config points to a readable directory.
 */
export declare function validateFileDirectory(directory: string): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=SecretResolver.d.ts.map