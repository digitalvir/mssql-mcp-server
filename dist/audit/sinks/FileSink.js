import * as fs from "fs";
import * as path from "path";
export class FileSink {
    constructor(filePath) {
        this.type = "file";
        if (filePath) {
            this.logFilePath = path.resolve(filePath);
        }
        else {
            this.logFilePath = path.resolve(process.cwd(), "logs", "audit.jsonl");
        }
        this.ensureDirectory();
    }
    ensureDirectory() {
        const dir = path.dirname(this.logFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    send(entry) {
        const logLine = JSON.stringify(entry) + "\n";
        fs.appendFileSync(this.logFilePath, logLine, { encoding: "utf-8" });
    }
}
//# sourceMappingURL=FileSink.js.map