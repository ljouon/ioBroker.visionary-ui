import * as utils from '@iobroker/adapter-core';
import { getLanguage, getRooms } from './FacilityManagement';
import { createWebServer, VisionaryUiWebServer } from './visionary-ui.web';
import { createSocketServer, VisionaryUiSocketServer } from './visionary-ui.socket';

export class VisionaryUiAdapter extends utils.Adapter {
    private webServer: VisionaryUiWebServer;
    private socketServer: VisionaryUiSocketServer;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'visionary-ui',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));

        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.webServer = createWebServer();
        this.socketServer = createSocketServer();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:

        /*
For every state in the system there has to be also an object of type state
Here a simple template for a boolean variable named "testVariable"
Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
*/
        // await this.setObjectNotExistsAsync('testVariable', {
        //     type: 'state',
        //     common: {
        //         name: 'testVariable',
        //         type: 'boolean',
        //         role: 'indicator',
        //         read: true,
        //         write: true,
        //     },
        //     native: {},
        // });

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');
        // this.subscribeForeignStates('*');

        /*
setState examples
you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
*/
        // the variable testVariable is set to true as command (ack=false)
        // const variable = await this.setStateAsync('testVariable', false);
        // console.log({ variable });
        //
        // // same thing, but the value is flagged "ack"
        // // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync('testVariable', { val: true, ack: true });
        //
        // // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });
        //
        // // examples for the checkPassword/checkGroup functions
        // let result = await this.checkPasswordAsync('admin', 'iobroker');
        // this.log.info('check user admin pw iobroker: ' + result);
        //
        // result = await this.checkGroupAsync('admin', 'admin');
        // this.log.info('check group user admin group admin: ' + result);

        // this.log.info(JSON.stringify(this.config));
        const webPort = parseInt(this.config.webPort, 10) || 8088;
        this.webServer.start(webPort);
        this.socketServer.start(8888);

        // Is this needed?
        this.loadInitialIoBrokerObjects();

        this.subscribeForeignStates('0_userdata.*');
        // this.subscribeForeignStates('*');
        this.subscribeForeignObjects('0_userdata.*');
        // this.subscribeForeignObjects('*');

        // this.getEnumsAsync(['enum.rooms']).then((enumRooms) => {
        //     this.log.info(JSON.stringify(enumRooms));
        // });
        //
        // this.getEnumsAsync(['enum.functions']).then((enumFunctions) => {
        //     this.log.info(JSON.stringify(enumFunctions));
        // });

        const language = await getLanguage(this);

        const rooms = await getRooms(this, language);
        // this.log.info(JSON.stringify(rooms));

        // Promise.all([
        //     this.getForeignObjectsAsync('system.config'),
        //     this.getEnumsAsync(['enum.rooms']),
        //     this.getEnumsAsync(['enum.functions']),
        // ]).then(([config, enumRooms, _]): void => {
        //     this.log.warn(JSON.stringify(config));
        //     this.log.warn(JSON.stringify(enumRooms != null));
        //     this.log.warn(JSON.stringify(enumRooms != null));
        //     this.visionaryServer.sendBroadcastMessage('enums loaded');
        //
        //     // this.subscribeForeignObjects('*');
        //     // this.subscribeObjects('configuration');
        // });

        this.socketServer.registerClientConnectionHandler({
            connect: (clientId) => {
                this.log.info(clientId);

                this.socketServer.sendMessageToClient(clientId, JSON.stringify({ language }));

                this.getForeignObjectsAsync('0_userdata.*', {})
                    .catch((err) => this.log.error(err.message))
                    .then((ioBrokerObjects) => {
                        if (ioBrokerObjects) {
                            Object.entries(ioBrokerObjects).forEach((entry) => {
                                const ioBrokerObject = entry[1];
                                const message = `Object (${ioBrokerObject._id}): ${JSON.stringify(ioBrokerObject)}`;

                                this.socketServer.sendMessageToClient(clientId, message);
                            });
                        }
                    });
            },
            disconnect: (clientId) => this.log.info(clientId),
        });
    }

    private loadInitialIoBrokerObjects(): void {
        this.getForeignObjectsAsync('0_userdata.*', {})
            .catch((err) => this.log.error(err.message))
            .then((ioBrokerObjects) => {
                if (ioBrokerObjects) {
                    Object.entries(ioBrokerObjects).forEach((entry) => {
                        this.log.info(JSON.stringify(entry[1]));
                        this.processIoBrokerObject(entry[1]);
                    });
                }
            });
    }

    private processIoBrokerObject(ioBrokerObject: ioBroker.AnyObject): void {
        const message = `Object (${ioBrokerObject._id}): ${JSON.stringify(ioBrokerObject)}`;
        this.log.info(message);
        this.socketServer.sendBroadcastMessage(message);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }

        this.webServer.stop();
        this.socketServer.stop();
    }

    /**
     * Is called if a subscribed state changes ({@see VisionaryUi constructor subscriptions})
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (!state) {
            // The state has been deleted
            this.log.info(`state ${id} deleted`);
            return;
        }

        // The state has been changed
        const message = `State (${id}): ${JSON.stringify(state)}`;
        this.log.info(message);
        this.socketServer.sendBroadcastMessage(message);
    }

    private onObjectChange(id: string, ioBrokerObject: ioBroker.Object | null | undefined): void {
        if (!ioBrokerObject) {
            // The object has been deleted
            this.log.info(`object ${id} deleted`);
            return;
        }

        // The object has been changed
        this.processIoBrokerObject(ioBrokerObject);
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever

    //             this.log.info('send command');
    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }
}
