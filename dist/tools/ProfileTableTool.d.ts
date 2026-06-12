import { Tool } from "@modelcontextprotocol/sdk/types.js";
type ProfileParams = {
    tableName: string;
    schemaName?: string;
    sampleSize?: number;
    includeDistributions?: boolean;
    topValuesLimit?: number;
    columnsToProfile?: string[];
    includeSamples?: boolean;
};
type NumericStats = {
    min: number;
    max: number;
    avg: number;
    median?: number;
    p90?: number;
};
type StringStats = {
    minLength: number;
    maxLength: number;
    avgLength: number;
    emptyCount: number;
};
type DateStats = {
    earliest: string;
    latest: string;
    range: string;
};
type TopValue = {
    value: any;
    count: number;
    percentage: number;
};
type ColumnProfile = {
    columnName: string;
    dataType: string;
    isNullable: boolean;
    nullCount: number;
    nullPercentage: number;
    distinctCount: number;
    cardinality: "unique" | "high" | "medium" | "low";
    numericStats?: NumericStats;
    stringStats?: StringStats;
    dateStats?: DateStats;
    topValues?: TopValue[];
};
type ProfileResult = {
    success: boolean;
    message?: string;
    tableName?: string;
    schemaName?: string;
    rowCount?: number;
    columnCount?: number;
    sampleSize?: number;
    columns?: ColumnProfile[];
    samples?: Record<string, unknown>[];
};
export declare class ProfileTableTool implements Tool {
    [key: string]: any;
    name: string;
    description: string;
    inputSchema: any;
    private static readonly SKIP_TYPES;
    private static readonly NUMERIC_TYPES;
    private static readonly STRING_TYPES;
    private static readonly DATE_TYPES;
    private normalizeLimit;
    private classifyCardinality;
    private formatDateRange;
    private escapeIdentifier;
    private isNumericType;
    private isStringType;
    private isDateType;
    private shouldSkipType;
    run(params: ProfileParams): Promise<ProfileResult>;
}
export {};
//# sourceMappingURL=ProfileTableTool.d.ts.map