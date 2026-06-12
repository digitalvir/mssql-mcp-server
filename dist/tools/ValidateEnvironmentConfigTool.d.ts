import { Tool } from "@modelcontextprotocol/sdk/types.js";
interface ValidationResult {
    environment: string;
    valid: boolean;
    errors: string[];
    warnings: string[];
}
interface SecretsValidationResult {
    providers: {
        type: string;
        valid: boolean;
        error?: string;
    }[];
    secrets: {
        name: string;
        resolved: boolean;
    }[];
}
interface ValidateEnvironmentConfigResult {
    success: boolean;
    summary: {
        totalEnvironments: number;
        validCount: number;
        invalidCount: number;
        warningCount: number;
    };
    results: ValidationResult[];
    secretsValidation?: SecretsValidationResult;
    configPath?: string;
}
export declare class ValidateEnvironmentConfigTool implements Tool {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            environment: {
                type: string;
                description: string;
            };
        };
    };
    run(args?: {
        environment?: string;
    }): Promise<ValidateEnvironmentConfigResult>;
    private validateEnvironment;
    private validateSecrets;
    private validateSecretsProviders;
}
export {};
//# sourceMappingURL=ValidateEnvironmentConfigTool.d.ts.map