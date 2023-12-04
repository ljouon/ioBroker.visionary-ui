import { createServer, Server } from 'http';
import express from 'express';
import path from 'path';
import { VisionaryUiServer } from './visionary-ui.server';

export type VisionaryUiWebServer = VisionaryUiServer;

export function createWebServer(): VisionaryUiWebServer {
    let webServer: Server | null;

    function createWebServer(): Server {
        const app = express();
        app.use('/', express.static(path.join(__dirname, '../build/client/')));
        app.get('/hello', (req, res) => {
            res.send('Hello!');
        });
        return createServer(app);
    }

    async function start(port: number): Promise<void> {
        return new Promise((resolve) => {
            webServer = createWebServer();
            webServer.listen(port, () => {
                console.log(`Web server started on port: ${port}`);
                resolve();
            });
        });
    }

    async function stop(): Promise<void> {
        return new Promise((resolve) => {
            // Close web server
            webServer?.close(() => {
                console.log('Web server closed');
                webServer = null;
                resolve();
            });
        });
    }

    return {
        start,
        stop,
    };
}
