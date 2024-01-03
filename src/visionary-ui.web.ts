import express from 'express';
import { createServer, Server } from 'http';
import path from 'path';

export class VisionaryUiWebServer {
    private webServer: Server | null = null;

    start(port: number): void {
        const createdWebServer = this.createWebServer();
        createdWebServer.listen(port, () => {
            // No Op
        });
        this.webServer = createdWebServer;
    }

    stop(): void {
        // Close web server
        this.webServer?.close(() => {
            this.webServer = null;
        });
    }

    private createWebServer(): Server {
        const app = express();
        app.use('/', express.static(path.join(__dirname, '../build/client/')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../build/client/', 'index.html'));
        });
        return createServer(app);
    }

    getServer(): Server {
        return this.webServer!;
    }
}
