import { createServer, Server } from 'http';
import express from 'express';
import path from 'path';
import { VisionaryUiServer } from './visionary-ui.server';

export class VisionaryUiWebServer extends VisionaryUiServer {
    private webServer: Server | null = null;

    async start(port: number): Promise<void> {
        return new Promise((resolve) => {
            this.webServer = this.createWebServer();
            this.webServer.listen(port, () => {
                console.log(`Web server started on port: ${port}`);
                resolve();
            });
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve) => {
            // Close web server
            this.webServer?.close(() => {
                console.log('Web server closed');
                this.webServer = null;
                resolve();
            });
        });
    }

    private createWebServer(): Server {
        const app = express();
        app.use('/', express.static(path.join(__dirname, '../build/client/')));
        app.get('/hello', (req, res) => {
            res.send('Hello!');
        });
        return createServer(app);
    }
}
