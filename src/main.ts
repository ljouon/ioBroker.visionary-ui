/*
 * Created with @iobroker/create-adapter v2.1.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import { createVisionaryServer, VisionaryServer } from './VisionaryServer';

class VisionaryUi extends utils.Adapter {
    // private readonly io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

    private readonly visionaryServer: VisionaryServer;

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
        this.on('exit', this.onExit.bind(this));

        this.visionaryServer = createVisionaryServer();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('config option1: ' + this.config.option1);
        this.log.info('config option2: ' + this.config.option2);

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
        this.subscribeForeignStates('0_userdata.*');
        // this.subscribeForeignStates('*');
        this.subscribeForeignObjects('0_userdata.*');
        // this.subscribeForeignObjects('*');

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

        this.log.info(JSON.stringify(this.config));
        const webServerPort = parseInt(this.config.webserverPort, 10) || 8088;
        this.visionaryServer.start(webServerPort, 8888);

        // this.getForeignObjectsAsync<ioBroker.ObjectType>('0_userdata.*', 'state')
        //     .catch((err) => this.log.error(err.message))
        //     .then((ioBrokerObjects) => {
        //         if (ioBrokerObjects) {
        //             Object.entries(ioBrokerObjects).forEach((entry) => {
        //                 this.processIoBrokerObject(entry[1]);
        //             });
        //         }
        //     });
    }

    private processIoBrokerObject(ioBrokerObject: ioBroker.AnyObject): void {
        this.log.info(`State: ${JSON.stringify(ioBrokerObject)}`);
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
            this.visionaryServer.stop();

            callback();
        } catch (e) {
            callback();
        }
    }

    private onExit(exitCode: number, reason: string): void {
        console.log('EXIT: ', { exitCode }, { reason });
        this.visionaryServer.shutDown();
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }

    // }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            const message = `${JSON.stringify(this.visionaryServer)}changed state ${id} : ${state.val} (ack = ${
                state.ack
            })`;
            this.visionaryServer.sendMessageToClients(message);
            this.log.info(message);
        } else {
            // The state was deleted
            this.log.info(`deleted state ${id}`);
        }
    }

    private onObjectChange(id: string, ioBrokerObject: ioBroker.Object | null | undefined): void {
        if (ioBrokerObject) {
            // this.log.info(`changed object ${id}: ${JSON.stringify(object)}`);
            this.processIoBrokerObject(ioBrokerObject);
        }
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

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new VisionaryUi(options);
} else {
    // otherwise start the instance directly
    (() => new VisionaryUi())();
}
