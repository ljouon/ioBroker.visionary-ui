/*
 * Created with @iobroker/create-adapter v2.1.1
 *
 * ... but a lot of stuff has happened after that ;-)
 */

// The adapter-core module gives you access to the core ioBroker functions
import * as utils from '@iobroker/adapter-core';
import { VisionaryUi } from './visionary-ui.adapter';

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new VisionaryUi(options);
} else {
    // otherwise start the instance directly
    (() => new VisionaryUi())();
}
