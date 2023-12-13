import * as utils from '@iobroker/adapter-core';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { VisionaryUiIoBrokerRepository } from './visionary-ui-iobroker.repository';
import { mapToIobEnum, mapToVuiStateObject, mapToVuiStateValue } from './visionary-ui.mapper';

type VisionaryUiManagedObjectTypes = 'state' | 'room' | 'function';

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
        await this.startCoordinator(language);

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

        await this.loadOrRefreshObjectData(language);
    }

    private async startCoordinator(language: ioBroker.Languages): Promise<void> {
        const webPort = parseInt(this.config.webPort, 10) || 8088;
        const socketPort = parseInt(this.config.socketPort, 10) || 8888;

        const adapterHandle = {
            setState: (clientId: string, stateId: string, value: string | number | boolean): void =>
                this.repository.setVuiStateValue(clientId, stateId, value),
            config: {
                language: language,
                webPort,
                socketPort,
            },
        };

        await this.coordinator.start(adapterHandle);
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
        const vuiStateValue = mapToVuiStateValue(id, state);
        this.coordinator.setState(vuiStateValue);
    }

    private async onObjectChange(id: string, object: ioBroker.Object | null | undefined): Promise<void> {
        const language: ioBroker.Languages = await this.repository.getLanguage();

        // The object has been deleted
        if (!object) {
            this.log.info(`object ${id} deleted`);
            // The object has been changed: it might be a state object or enum (room, function)
            switch (this.determineObjectTypeById(id)) {
                case 'room':
                    return await this.handleRoomEnumObjectDeletion(id, language);
                case 'function':
                    return await this.handleFunctionEnumObjectDeletion(id, language);
                default:
                    // Object type is either a state object or not managed by visionary ui adapter
                    // The ID might be deleted from state management
                    return await this.handleStateObjectDeletion(id);
            }
        } else {
            // The object has been changed: it might be a state object or enum (room, function)
            switch (this.determineObjectType(object)) {
                case 'state':
                    return await this.handleStateObjectChange(id, object, language);
                case 'room':
                    return await this.handleRoomEnumObjectChange(id, object, language);
                case 'function':
                    return await this.handleFunctionEnumChange(id, object, language);
                default:
                    // Object type not managed by visionary ui adapter
                    return Promise.resolve();
            }
        }
    }

    private determineObjectType(object: ioBroker.Object): VisionaryUiManagedObjectTypes | undefined {
        if (object.type === 'state') {
            return 'state';
        }

        if (object.type === 'enum') {
            if (object._id.startsWith('enum.rooms')) {
                return 'room';
            } else if (object._id.startsWith('enum.functions')) {
                return 'function';
            }
        }
    }

    private determineObjectTypeById(id: string): VisionaryUiManagedObjectTypes | undefined {
        if (id.startsWith('enum.rooms')) {
            return 'room';
        } else if (id.startsWith('enum.functions')) {
            return 'function';
        } else {
            return undefined;
        }
    }

    private handleStateObjectChange(id: string, object: ioBroker.Object, language: ioBroker.Languages): Promise<void> {
        const vuiStateObject = mapToVuiStateObject(id, object, language);
        this.coordinator.setObject(vuiStateObject);
        return Promise.resolve();
    }

    private async handleRoomEnumObjectChange(
        id: string,
        object: ioBroker.Object,
        language: ioBroker.Languages,
    ): Promise<void> {
        const iobEnum = mapToIobEnum(id, object, language);
        this.coordinator.setRoom({ ...iobEnum, type: 'room' });
        await this.loadOrRefreshObjectData(language);
    }

    private async handleFunctionEnumChange(
        id: string,
        object: ioBroker.Object,
        language: ioBroker.Languages,
    ): Promise<void> {
        const iobEnum = mapToIobEnum(id, object, language);
        this.coordinator.setFunction({ ...iobEnum, type: 'function' });
        await this.loadOrRefreshObjectData(language);
    }

    private async handleRoomEnumObjectDeletion(id: string, language: ioBroker.Languages): Promise<void> {
        this.coordinator.deleteRoom(id);
        await this.loadOrRefreshObjectData(language);
    }

    private async handleFunctionEnumObjectDeletion(id: string, language: ioBroker.Languages): Promise<void> {
        this.coordinator.deleteFunction(id);
        await this.loadOrRefreshObjectData(language);
    }

    private async handleStateObjectDeletion(id: string): Promise<void> {
        this.coordinator.deleteObject(id);
    }

    private async loadOrRefreshObjectData(language: ioBroker.Languages): Promise<void> {
        const objects = await this.repository.getIoBrokerStateObjects(language);
        this.log.info(JSON.stringify(objects));
        this.coordinator.setObjects(objects);

        const states = await this.repository.getIoBrokerStateValues();
        this.coordinator.setStates(states);
    }
}
