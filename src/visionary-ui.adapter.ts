import * as utils from '@iobroker/adapter-core';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { VisionaryUiIoBrokerRepository } from './visionary-ui-iobroker.repository';
import { mapToIobFunction, mapToIobObject, mapToIobRoom, mapToIobState } from './visionary-ui.mapper';
import { IobObjectCache } from './domain';

export class VisionaryUiAdapter extends utils.Adapter {
    private repository: VisionaryUiIoBrokerRepository;
    private coordinator: VisionaryUiCoordinator;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'visionary-ui',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.repository = new VisionaryUiIoBrokerRepository(this);
        this.coordinator = new VisionaryUiCoordinator();
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialization

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

        const language = await this.repository.getLanguage();

        // Start coordinator between ioBroker and visionary ui
        this.startCoordinator(language);

        // this.subscribeForeignStates('0_userdata.*');
        this.subscribeForeignStates('*');
        // this.subscribeForeignObjects('0_userdata.*');
        this.subscribeForeignObjects('*');

        // Read all room definitions
        const rooms = await this.repository.getRooms(language);
        this.coordinator.setRooms(rooms);

        // Read all function definitions
        const functions = await this.repository.getFunctions(language);
        this.coordinator.setFunctions(functions);

        this.loadOrRefreshObjectData(language);
    }

    private startCoordinator(language: ioBroker.Languages): void {
        const webPort = parseInt(this.config.webPort, 10) || 8088;
        const socketPort = parseInt(this.config.socketPort, 10) || 8888;

        const adapterHandle = {
            setState: (clientId: string, stateId: string, value: string | number | boolean): void =>
                this.repository.setIobState(clientId, stateId, value),
            config: {
                language: language,
                webPort,
                socketPort,
            },
        };

        this.coordinator.start(adapterHandle);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout);
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
            // TODO: Handle deletion by ID in rooms, functions, objects
            return;
        }

        // The object has been changed: it might be a statObject or enum (room, function)
        this.repository.getLanguage().then((language: ioBroker.Languages) => {
            if (object.type === 'state') {
                const iobObject = mapToIobObject(id, object, language);
                this.coordinator.setObject(iobObject);
            } else if (object.type === 'enum') {
                if (id.startsWith('enum.rooms')) {
                    const iobObject = mapToIobRoom(id, object, language);
                    this.coordinator.setRoom(iobObject);
                    this.loadOrRefreshObjectData(language);
                } else if (id.startsWith('enum.functions')) {
                    const iobObject = mapToIobFunction(id, object, language);
                    this.coordinator.setFunction(iobObject);
                    this.loadOrRefreshObjectData(language);
                }
            }
        });
    }

    private loadOrRefreshObjectData(language: ioBroker.Languages): void {
        this.repository.getIoBrokerStateObjects(language).then((objects: IobObjectCache) => {
            this.coordinator.setObjects(objects);

            this.repository.getIoBrokerStateValues().then((states) => {
                this.coordinator.setStates(states);
            });
        });
    }
}
