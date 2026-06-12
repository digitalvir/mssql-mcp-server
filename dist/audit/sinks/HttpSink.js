export class HttpSink {
    constructor(config) {
        this.type = "http";
        this.buffer = [];
        this.timer = null;
        this.closed = false;
        this.url = config.url;
        this.headers = config.headers ?? {};
        this.method = config.method ?? "POST";
        this.batchSize = config.batchSize ?? 10;
        this.flushIntervalMs = config.flushIntervalMs ?? 5000;
        this.timer = setInterval(() => {
            this.flush().catch(() => { });
        }, this.flushIntervalMs);
        this.timer.unref();
    }
    send(entry) {
        if (this.closed)
            return;
        this.buffer.push(entry);
        if (this.buffer.length >= this.batchSize) {
            this.flush().catch(() => { });
        }
    }
    async flush() {
        if (this.buffer.length === 0)
            return;
        const entries = this.buffer.splice(0);
        try {
            await this.post(entries);
        }
        catch {
            // Single retry
            try {
                await this.post(entries);
            }
            catch (retryErr) {
                process.stderr.write(`[HttpSink] Failed to send ${entries.length} audit entries after retry: ${retryErr}\n`);
                // Drop entries
            }
        }
    }
    async close() {
        this.closed = true;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        await this.flush();
    }
    async post(entries) {
        const response = await fetch(this.url, {
            method: this.method,
            headers: {
                "Content-Type": "application/json",
                ...this.headers,
            },
            body: JSON.stringify(entries),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
}
//# sourceMappingURL=HttpSink.js.map