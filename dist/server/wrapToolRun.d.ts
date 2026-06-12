import type { WrapToolRunOptions } from "../types.js";
/**
 * Monkey-patches a tool's `run()` method to:
 *  1. Resolve the target environment and enforce policies
 *  2. Obtain a connection pool from EnvironmentManager
 *  3. Inject pool + environment info into the tool arguments
 *  4. Log invocations to the audit logger
 */
export declare function wrapToolRun(tool: {
    name: string;
    run: (...args: any[]) => Promise<any>;
}, options: WrapToolRunOptions): void;
//# sourceMappingURL=wrapToolRun.d.ts.map