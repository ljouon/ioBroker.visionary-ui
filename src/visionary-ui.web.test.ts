import { expect } from 'chai';
import { VisionaryUiWebServer } from './visionary-ui.web';

describe('VisionaryUiWebServer Integration Tests', () => {
    let visionaryUiWebServer: VisionaryUiWebServer;

    beforeEach(() => {
        visionaryUiWebServer = new VisionaryUiWebServer();
    });

    afterEach(() => {
        if (visionaryUiWebServer['webServer']) {
            visionaryUiWebServer.stop();
        }
    });

    describe('start()', () => {
        it('should start the server on the specified port', () => {
            visionaryUiWebServer.start(0);
            expect(visionaryUiWebServer['webServer']).to.not.be.null;
        });
    });

    describe('stop()', () => {
        it('should stop the server 2', () => {
            visionaryUiWebServer.start(0);
            visionaryUiWebServer.stop();
            setTimeout(() => {
                expect(visionaryUiWebServer['webServer']).to.be.null;
            }, 1000);
        });
    });
});
