/**
 * Runtime shims required before any MCP server code runs.
 * Call initShims() at the top of your entry point.
 */
import { Buffer } from "node:buffer";
import * as dotenv from "dotenv";
export function initShims() {
    // Node 21+ dropped the legacy global SlowBuffer. Some transitive deps (jsonwebtoken)
    // still reference it, so reintroduce a shim to keep compatibility with latest Node.
    if (!globalThis.SlowBuffer) {
        globalThis.SlowBuffer = Buffer.allocUnsafeSlow;
    }
    dotenv.config();
}
//# sourceMappingURL=shims.js.map