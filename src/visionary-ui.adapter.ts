import * as utils from '@iobroker/adapter-core';
import { getFunctions, getLanguage, getRooms, mapToIobObject, mapToIobState } from './FacilityManagement';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { IobObjectCache, IobStateCache } from './domain';

export class VisionaryUiAdapter extends utils.Adapter {
    private coordinator: VisionaryUiCoordinator;

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

        this.coordinator = new VisionaryUiCoordinator();
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

        const language = await getLanguage(this);

        // Start coordinator between ioBroker and visionary ui
        this.startCoordinator(language);

        // this.subscribeForeignStates('0_userdata.*');
        this.subscribeForeignStates('*');
        // this.subscribeForeignObjects('0_userdata.*');
        this.subscribeForeignObjects('*');

        // Read all room definitions
        const rooms = await getRooms(this, language);
        this.coordinator.setRooms(rooms);

        // Read all function definitions
        const functions = await getFunctions(this, language);
        this.coordinator.setFunctions(functions);

        // Read all objects
        // TODO: filter on rooms and functions
        const objects = await this.loadInitialIoBrokerObjects(language);
        this.coordinator.setObjects(objects);

        // Read all initial states
        // TODO: filter on rooms and functions
        const states = await this.loadInitialIoBrokerStates();
        this.coordinator.setStates(states);
    }

    private startCoordinator(language: ioBroker.Languages): void {
        const webPort = parseInt(this.config.webPort, 10) || 8088;
        const socketPort = parseInt(this.config.socketPort, 10) || 8888;

        const adapterHandle = {
            setState: (clientId: string, stateId: string, value: string | number | boolean): void =>
                this.setIobState(clientId, stateId, value),
            config: {
                language: language,
                webPort,
                socketPort,
            },
        };

        this.coordinator.start(adapterHandle);
    }

    private async loadInitialIoBrokerObjects(language: ioBroker.Languages): Promise<IobObjectCache> {
        const objectCache = new IobObjectCache();
        const ioBrokerObjects = await this.getForeignObjectsAsync('*', {});
        if (ioBrokerObjects) {
            Object.entries(ioBrokerObjects).forEach((entry) => {
                const key = entry[0];
                // If not deleted
                if (entry[1]) {
                    const value = mapToIobObject(key, entry[1], language);
                    objectCache.set(key, value);
                }
            });
        }
        return objectCache;
    }

    private async loadInitialIoBrokerStates(): Promise<IobStateCache> {
        const stateCache = new IobStateCache();
        const ioBrokerStates = await this.getForeignStatesAsync('*', {});
        if (ioBrokerStates) {
            Object.entries(ioBrokerStates).forEach((entry) => {
                const key = entry[0];
                // If not deleted
                if (entry[1]) {
                    const value = mapToIobState(key, entry[1]);
                    stateCache.set(key, value);
                }
            });
        }
        return stateCache;
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

        this.coordinator.stop();
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
        const iobState = mapToIobState(id, state);
        this.coordinator.setState(iobState);
    }

    private onObjectChange(id: string, object: ioBroker.Object | null | undefined): void {
        if (!object) {
            // The object has been deleted
            this.log.info(`object ${id} deleted`);
            return;
        }

        getLanguage(this).then((language) => {
            // The object has been changed
            const iobObject = mapToIobObject(id, object, language);
            this.coordinator.setObject(iobObject);
        });
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

    private setIobState(clientId: string, stateId: string, value: string | number | boolean): void {
        // const user = this.config.defaultUser)
        new Date().getUTCMilliseconds();
        const state = {
            val: value,
            ack: false,
            lc: Date.now(),
        };
        this.getForeignStateAsync(stateId).then((state) => {
            this.log.info(`Get state "${state}"`);
            // Send feedback to client
        });

        this.log.info(`Setting state ${JSON.stringify(state)}`);
        this.setForeignStateAsync(stateId, state).catch(() => {
            this.log.error(`Error setting state "${stateId}" for client "${clientId}"`);
            // Send feedback to client
        });
    }
}
