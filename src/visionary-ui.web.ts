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

    const start = (port: number): void => {
        webServer = createWebServer();
        webServer.listen(port, () => {
            console.log(`Web server started on port: ${port}`);
        });
    };

    const stop = (): void => {
        // Close web server
        webServer?.close(() => {
            console.log('Web server closed');
            webServer = null;
        });
    };

    return {
        start,
        stop,
    };
}
