import { expect } from 'chai';
import { VisionaryUiWebServer } from './visionary-ui.web';

describe('VisionaryUiWebServer Integration Tests', () => {
    let visionaryUiWebServer: VisionaryUiWebServer;

    beforeEach(() => {
        visionaryUiWebServer = new VisionaryUiWebServer();
    });

    afterEach(async () => {
        if (visionaryUiWebServer['webServer']) {
            await visionaryUiWebServer.stop();
        }
    });

    describe('start()', () => {
        it('should start the server on the specified port', async () => {
            await visionaryUiWebServer.start(0);
            expect(visionaryUiWebServer['webServer']).to.not.be.null;
            // Additional assertions can be made here
        });
    });

    describe('stop()', () => {
        it('should stop the server', async () => {
            await visionaryUiWebServer.start(0);
            await visionaryUiWebServer.stop();
            expect(visionaryUiWebServer['webServer']).to.be.null;
            // Additional assertions can be made here
        });
    });
});
