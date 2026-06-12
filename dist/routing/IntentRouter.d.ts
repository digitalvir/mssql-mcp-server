import type { IntentRouterOptions, RouteParams, RouteResult } from "../types.js";
export declare class IntentRouter {
    private readonly tools;
    private readonly allowMutations;
    private readonly requireConfirmationForMutations;
    constructor(options: IntentRouterOptions);
    route(params: RouteParams): Promise<RouteResult>;
    private inferEnvironment;
    private normalizeArguments;
    private isToolEligible;
    private inferIntent;
    private extractSqlSnippet;
    private scoreTool;
    private hasArgument;
    private getMissingArguments;
}
//# sourceMappingURL=IntentRouter.d.ts.map