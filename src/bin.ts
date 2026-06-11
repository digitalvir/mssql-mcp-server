#!/usr/bin/env node
import { createRequire } from "node:module";
import { startMcpServer } from "./index.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

startMcpServer({
  name: "mssql-mcp-server",
  version,
  tier: "admin",
  transactionMode: "none",
}).catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
