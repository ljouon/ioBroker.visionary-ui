import * as utils from '@iobroker/adapter-core';
import { VisionaryUiCoordinator } from './visionary-ui.coordinator';
import { IobObjectCache, IobRoomCache, IobStateCache } from './domain';
import { VisionaryUiIoBrokerRepository } from './visionary-ui-iobroker.repository';
import { mapToIobObject, mapToIobRoom, mapToIobState } from './visionary-ui.mapper';

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

        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.repository = new VisionaryUiIoBrokerRepository(this);
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

        const newRooms = await this.loadInitialIoBrokerRoomObjects(language);
        this.log.info(JSON.stringify({ newRooms }));

        // Read all function definitions
        const functions = await this.repository.getFunctions(language);
        this.coordinator.setFunctions(functions);

        // Read all objects
        const objects = await this.loadInitialIoBrokerStateObjects(language);
        this.coordinator.setObjects(objects);

        // Read all initial states
        const states = await this.loadInitialIoBrokerStateValues();
        this.coordinator.setStates(states);
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

    private async loadInitialIoBrokerStateObjects(language: ioBroker.Languages): Promise<IobObjectCache> {
        return this.getForeignObjectsAsync('*', { type: 'state' }).then((ioBrokerObjects) =>
            Object.entries(ioBrokerObjects).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                // If not deleted
                if (entryElement) {
                    const iobObject = mapToIobObject(entryId, entryElement, language);
                    cache.set(entryId, iobObject);
                }
                return cache;
            }, new IobObjectCache()),
        );
    }

    private async loadInitialIoBrokerRoomObjects(language: ioBroker.Languages): Promise<IobRoomCache> {
        return this.getForeignObjectsAsync('*', { type: 'enum' }).then((ioBrokerObjects) =>
            Object.entries(ioBrokerObjects).reduce((cache, entry) => {
                const id = entry[0];
                const entryElement = entry[1];
                // If not deleted
                if (entryElement) {
                    this.log.info(JSON.stringify(entryElement));
                    if (id.startsWith('enum.rooms')) {
                        // Refactor to handle functions as well
                        const iobRoom = mapToIobRoom(id, entryElement, language);
                        cache.set(id, iobRoom);
                    }
                }
                return cache;
            }, new IobRoomCache()),
        );
    }

    private async loadInitialIoBrokerStateValues(): Promise<IobStateCache> {
        return this.getForeignStatesAsync('*', {}).then((ioBrokerStates) =>
            Object.entries(ioBrokerStates).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                // If not deleted
                if (entryElement) {
                    const iobState = mapToIobState(entryId, entryElement);
                    cache.set(entryId, iobState);
                }
                return cache;
            }, new IobStateCache()),
        );
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
        this.log.info(JSON.stringify(object));
        if (!object) {
            // The object has been deleted
            this.log.info(`object ${id} deleted`);
            // Handle deletion by ID in rooms, functions, objects
            return;
        }

        // TODO: Handle enum change
        /**
         * modify data structure and keep references enum to objects, different to current variant
         * members
         * 2023-12-03 01:55:26.202	info	{"type":"enum","common":{"name":{"en":"Ground Floor","ru":"Первый этаж","de":"Erdgeschoss","fr":"Rez-De-Chaussée","it":"Piano Terra","nl":"Begane Grond","pl":"Parter","pt":"Térreo","es":"Planta Baja","zh-cn":"一楼"},"color":"","desc":"","members":[],"icon":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiPgogICAgPGcgZmlsbD0iY3VycmVudENvbG9yIj4KICAgICAgICA8cGF0aCBzdHJva2U9IiIgZD0iTTQ3Ny40NDQsNDcxLjAzNGgtMy44MzNjLTMuNjc5LTE0LjQzNS0xNS45MjYtMjUuMzU2LTMwLjg1OS0yNy4yNDFWMzA4LjU4N2gyLjEzOGM5LjkxNywwLDE3Ljk4NS04LjA2OCwxNy45ODUtMTcuOTg2CgkJCWMwLTkuOTE3LTguMDY4LTE3Ljk4NS0xNy45ODUtMTcuOTg1aC0yLjEzOFYxMjkuMzgyaDkuODE1YzcuMTk3LDAsMTMuMDUyLTUuODU1LDEzLjA1Mi0xMy4wNTJ2LTE0LjkwNAoJCQljMC0wLjAzMy0wLjAwNS0wLjA2NS0wLjAwNS0wLjA5OGMtMC4wMDEtMC4wOTgtMC4wMDktMC4xOTYtMC4wMTUtMC4yOTRjLTAuMDA5LTAuMTcxLTAuMDIxLTAuMzQyLTAuMDQyLTAuNTEKCQkJYy0wLjAxMS0wLjA4OS0wLjAyNi0wLjE3Ny0wLjA0MS0wLjI2NmMtMC4wMjktMC4xODMtMC4wNjUtMC4zNjQtMC4xMDgtMC41NDJjLTAuMDEtMC4wNC0wLjAxNC0wLjA4MS0wLjAyNC0wLjEyMUw0NDYuMTIzLDI1LjQyCgkJCWMtMS41NzQtNi4wNi03LjA0Ny0xMC4yOTMtMTMuMzA3LTEwLjI5M2gtNDkuMTA1Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3czMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3aDQ4LjQ2OGwxNi43MzQsNjQuNDQKCQkJSDMzNS4zNzJMMjkyLjM0NywyOS43aDQ1Ljg2NmM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3YzAtNC4wMjUtMy4yNjItNy4yODctNy4yODctNy4yODdoLTU1LjU5NmwtMC45MjYtMS4zODcKCQkJQzI3NS45NDgsNS4xMzcsMjY2LjM0MiwwLDI1NS45OTcsMGMtMTAuMzQ1LDAtMTkuOTUsNS4xMzYtMjUuNjk0LDEzLjczOWwtMC45MjcsMS4zODhINzkuMTc4CgkJCWMtNi4yNjEsMC0xMS43MzMsNC4yMzItMTMuMzA3LDEwLjI5M0w0Ni42MDksOTkuNTk1Yy0wLjAxLDAuMDQtMC4wMTQsMC4wODEtMC4wMjQsMC4xMjFjLTAuMDQzLDAuMTc4LTAuMDc5LDAuMzU5LTAuMTA4LDAuNTQyCgkJCWMtMC4wMTQsMC4wODktMC4wMywwLjE3Ny0wLjA0MSwwLjI2NmMtMC4wMjEsMC4xNjgtMC4wMzMsMC4zMzgtMC4wNDIsMC41MWMtMC4wMDUsMC4wOTgtMC4wMTQsMC4xOTYtMC4wMTUsMC4yOTQKCQkJYzAsMC4wMzMtMC4wMDUsMC4wNjUtMC4wMDUsMC4wOTh2MTQuOTA0YzAsNy4xOTcsNS44NTUsMTMuMDUyLDEzLjA1MiwxMy4wNTJoOS44MTV2MTQzLjIzM2gtMi4xMzgKCQkJYy05LjkxNywwLTE3Ljk4NSw4LjA2OC0xNy45ODUsMTcuOTg1czguMDY4LDE3Ljk4NiwxNy45ODUsMTcuOTg2aDIuMTM4djQ2LjY5NmMwLDQuMDI0LDMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3CgkJCXM3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4N3YtNDYuNjk2aDM0NC4zNjR2MTI5LjMxMWMtMC4wNTUtMC4wMzItMC4xMTMtMC4wNi0wLjE2OS0wLjA5MmMtMC43MTQtMC40MTUtMS40MzktMC44MS0yLjE3Ni0xLjE4MgoJCQljLTAuMTQ0LTAuMDczLTAuMjkxLTAuMTM5LTAuNDM1LTAuMjFjLTAuNjE0LTAuMzAyLTEuMjM1LTAuNTg4LTEuODYzLTAuODU5Yy0wLjIxMy0wLjA5Mi0wLjQyNS0wLjE4My0wLjYzOS0wLjI3MgoJCQljLTAuNzI3LTAuMy0xLjQ1OS0wLjU4NS0yLjIwMi0wLjg0NGMtMC4wNDQtMC4wMTUtMC4wODctMC4wMzMtMC4xMzEtMC4wNDljLTAuNzg0LTAuMjcxLTEuNTc4LTAuNTExLTIuMzc4LTAuNzM2CgkJCWMtMC4yMTktMC4wNjItMC40NC0wLjExOC0wLjY2LTAuMTc2Yy0wLjY0Mi0wLjE2OS0xLjI4OS0wLjMyMy0xLjk0LTAuNDYyYy0wLjE4OC0wLjA0LTAuMzc1LTAuMDg1LTAuNTY0LTAuMTIzCgkJCWMtMC44MTItMC4xNjItMS42MjktMC4zLTIuNDUxLTAuNDE0Yy0wLjE3OC0wLjAyNS0wLjM1OC0wLjA0Mi0wLjUzNy0wLjA2NGMtMC42NzEtMC4wODQtMS4zNDUtMC4xNTItMi4wMjItMC4yMDQKCQkJYy0wLjIzNC0wLjAxOC0wLjQ2OC0wLjAzNi0wLjcwMi0wLjA1MWMtMC44NDItMC4wNTEtMS42ODUtMC4wODUtMi41MzMtMC4wODVjLTE1LjQ0NiwwLTI5LjY5OSw4LjYxLTM3LjA2MiwyMS45MTUKCQkJYy0wLjg0Ni0wLjAyLTEuNjg0LDAuMDAxLTIuNTE2LDAuMDQ2Yy0wLjE5NSwwLjAxMS0wLjM4NywwLjAzNC0wLjU4MSwwLjA0OGMtMC42MzYsMC4wNDctMS4yNjgsMC4xMDctMS44OTQsMC4xOQoJCQljLTAuMjMsMC4wMzEtMC40NTgsMC4wNzEtMC42ODYsMC4xMDdjLTAuNTg2LDAuMDkyLTEuMTY4LDAuMTk3LTEuNzQ0LDAuMzIxYy0wLjIzNCwwLjA1LTAuNDY1LDAuMTA0LTAuNjk3LDAuMTU5CgkJCWMtMC41NzEsMC4xMzctMS4xMzUsMC4yODktMS42OTUsMC40NTdjLTAuMjE3LDAuMDY1LTAuNDM1LDAuMTI4LTAuNjUsMC4xOThjLTAuNTg4LDAuMTktMS4xNjcsMC40LTEuNzQsMC42MjQKCQkJYy0wLjE3MSwwLjA2Ny0wLjM0NSwwLjEyNy0wLjUxNSwwLjE5N2MtMC43MDUsMC4yOS0xLjM5OSwwLjYwMi0yLjA3OSwwLjk0MWMtMC4wMjgsMC4wMTQtMC4wNTgsMC4wMjYtMC4wODYsMC4wNAoJCQljLTAuNzMzLDAuMzY5LTEuNDUsMC43NjYtMi4xNSwxLjE5Yy0wLjA2NiwwLjA0LTAuMTI5LDAuMDg2LTAuMTk1LDAuMTI3Yy0wLjYsMC4zNy0xLjE4NywwLjc1OS0xLjc2LDEuMTY5CgkJCWMtMC4xODQsMC4xMzItMC4zNjEsMC4yNzItMC41NDIsMC40MDhjLTAuNDQ3LDAuMzM1LTAuODg4LDAuNjc3LTEuMzE2LDEuMDM2Yy0wLjIwNiwwLjE3Mi0wLjQwNywwLjM1MS0wLjYwOSwwLjUyOQoJCQljLTAuMzkxLDAuMzQ1LTAuNzc0LDAuNjk4LTEuMTQ4LDEuMDYzYy0wLjIwMSwwLjE5Ni0wLjQwMSwwLjM5NC0wLjU5NywwLjU5NmMtMC4zNjUsMC4zNzYtMC43MTcsMC43NjMtMS4wNjQsMS4xNTgKCQkJYy0wLjE3OCwwLjIwMy0wLjM1OSwwLjQwNC0wLjUzMywwLjYxMmMtMC4zNjcsMC40NDEtMC43MTcsMC44OTctMS4wNiwxLjM1OWMtMC4xMzEsMC4xNzYtMC4yNjksMC4zNDYtMC4zOTYsMC41MjUKCQkJYy0wLjg4NSwxLjI0Ni0xLjY4OSwyLjU2LTIuMzkyLDMuOTQ0aC0zNS40NTdWMzQ2LjE4MWMwLTcuMTM1LTUuODA1LTEyLjkzOS0xMi45MzktMTIuOTM5aC03My4zNDkKCQkJYy03LjEzNSwwLTEyLjkzOSw1LjgwNS0xMi45MzksMTIuOTM5djEyNC44NTNoLTYwLjYzOWMtMC4xODgtMC40NjktMC4zOTktMC45MjUtMC42MDUtMS4zODMKCQkJYy0wLjA4OC0wLjE5NC0wLjE2Ni0wLjM5NC0wLjI1Ni0wLjU4NmMtMC4zNTMtMC43NDktMC43MjgtMS40ODMtMS4xMjgtMi4yMDJjLTAuMDc1LTAuMTM1LTAuMTYtMC4yNjMtMC4yMzYtMC4zOTcKCQkJYy0wLjMzMS0wLjU3Ny0wLjY3My0xLjE0Ny0xLjAzNC0xLjcwM2MtMC4xNTEtMC4yMzItMC4zMTEtMC40NTYtMC40NjctMC42ODVjLTAuMzA1LTAuNDQ4LTAuNjE2LTAuODkxLTAuOTQtMS4zMjQKCQkJYy0wLjE4My0wLjI0NS0wLjM3Mi0wLjQ4NC0wLjU2Mi0wLjcyNGMtMC4zMi0wLjQwNS0wLjY0Ni0wLjgwMy0wLjk4Mi0xLjE5M2MtMC4yMDItMC4yMzQtMC40MDUtMC40NjctMC42MTItMC42OTUKCQkJYy0wLjM1Mi0wLjM4OC0wLjcxNC0wLjc2Ni0xLjA4MS0xLjEzOGMtMC4yMDUtMC4yMDctMC40MDctMC40MTctMC42MTYtMC42MmMtMC40MTktMC40MDUtMC44NTItMC43OTQtMS4yOS0xLjE3OAoJCQljLTAuMTcyLTAuMTUxLTAuMzM3LTAuMzA4LTAuNTExLTAuNDU1Yy0wLjYyMi0wLjUyNS0xLjI1OS0xLjAzMS0xLjkxNC0xLjUxM2MtMC4wNjctMC4wNDktMC4xMzctMC4wOTMtMC4yMDQtMC4xNDEKCQkJYy0wLjU4OC0wLjQyNi0xLjE4OC0wLjgzNi0xLjgwMS0xLjIyNmMtMC4yMjUtMC4xNDQtMC40NTgtMC4yNzYtMC42ODYtMC40MTRjLTAuNDY3LTAuMjgzLTAuOTM4LTAuNTYyLTEuNDE4LTAuODI0CgkJCWMtMC4yNy0wLjE0OC0wLjU0NS0wLjI4Ny0wLjgxOS0wLjQyOGMtMC40NTYtMC4yMzQtMC45MTYtMC40NjEtMS4zODMtMC42NzZjLTAuMjktMC4xMzQtMC41ODEtMC4yNjQtMC44NzUtMC4zOTEKCQkJYy0wLjQ3My0wLjIwMy0wLjk1My0wLjM5NC0xLjQzNi0wLjU3OGMtMC4yOTEtMC4xMS0wLjU3OS0wLjIyMy0wLjg3My0wLjMyNmMtMC41MjgtMC4xODYtMS4wNjUtMC4zNTMtMS42MDQtMC41MTQKCQkJYy0wLjI1Ni0wLjA3Ny0wLjUwOC0wLjE2Mi0wLjc2Ni0wLjIzM2MtMC44LTAuMjIxLTEuNjA4LTAuNDIxLTIuNDI4LTAuNTg4Yy0wLjUyNy0wLjcxOC0xLjA3NC0xLjQxOC0xLjYzNy0yLjA5OQoJCQljLTAuMTkzLTAuMjMzLTAuMzk4LTAuNDUyLTAuNTk1LTAuNjgxYy0wLjM3OC0wLjQ0LTAuNzU0LTAuODgyLTEuMTQ3LTEuMzA2Yy0wLjI0Ni0wLjI2NS0wLjUwNS0wLjUxNC0wLjc1Ny0wLjc3MgoJCQljLTAuMzYtMC4zNjktMC43MTYtMC43NDQtMS4wODctMS4xYy0wLjI3Ny0wLjI2NS0wLjU2Ni0wLjUxNC0wLjg0OS0wLjc3MmMtMC4zNjItMC4zMy0wLjcxOS0wLjY2NC0xLjA5MS0wLjk4MQoJCQljLTAuMzAxLTAuMjU3LTAuNjE0LTAuNDk4LTAuOTIxLTAuNzQ3Yy0wLjM2OC0wLjI5OC0wLjczMi0wLjYtMS4xMDgtMC44ODZjLTAuMzIyLTAuMjQ0LTAuNjU0LTAuNDcyLTAuOTgxLTAuNzA3CgkJCWMtMC4zNzYtMC4yNy0wLjc0OS0wLjU0NC0xLjEzMy0wLjgwMWMtMC4zMzktMC4yMjctMC42ODctMC40MzktMS4wMzEtMC42NTdjLTAuMzg3LTAuMjQ1LTAuNzcxLTAuNDkzLTEuMTY0LTAuNzI1CgkJCWMtMC4zNTMtMC4yMDktMC43MTUtMC40MDItMS4wNzQtMC42MDFjLTAuMzk3LTAuMjItMC43OTItMC40NDMtMS4xOTYtMC42NTFjLTAuMzY4LTAuMTktMC43NDItMC4zNjQtMS4xMTUtMC41NDQKCQkJYy0wLjQwNi0wLjE5NS0wLjgxMS0wLjM5My0xLjIyNC0wLjU3NmMtMC4zOC0wLjE2OS0wLjc2NS0wLjMyMy0xLjE1LTAuNDgyYy0wLjQxNy0wLjE3MS0wLjgzMi0wLjM0NC0xLjI1NS0wLjUwMwoJCQljLTAuMzg5LTAuMTQ3LTAuNzg0LTAuMjgtMS4xNzgtMC40MTZjLTAuNDI3LTAuMTQ3LTAuODU0LTAuMjk2LTEuMjg2LTAuNDNjLTAuMzk4LTAuMTI0LTAuODAxLTAuMjM2LTEuMjA0LTAuMzQ5CgkJCWMtMC40MzctMC4xMjMtMC44NzMtMC4yNDYtMS4zMTQtMC4zNTZjLTAuNDA3LTAuMTAxLTAuODE3LTAuMTkxLTEuMjI3LTAuMjgxYy0wLjQ0NS0wLjA5OC0wLjg5LTAuMTk0LTEuMzM4LTAuMjc5CgkJCWMtMC40MTQtMC4wNzgtMC44MzEtMC4xNDUtMS4yNDgtMC4yMTJjLTAuNDUzLTAuMDcyLTAuOTA1LTAuMTQzLTEuMzYxLTAuMjAyYy0wLjQyLTAuMDU0LTAuODQyLTAuMDk4LTEuMjY0LTAuMTQxCgkJCWMtMC40Ni0wLjA0Ny0wLjkyMS0wLjA5LTEuMzg1LTAuMTIyYy0wLjQyNC0wLjAzLTAuODUtMC4wNTEtMS4yNzYtMC4wNjljLTAuMjY5LTAuMDEyLTAuNTM0LTAuMDM2LTAuODA0LTAuMDQzdi0yOS44NTEKCQkJYzAtNC4wMjQtMy4yNjItNy4yODctNy4yODctNy4yODdjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODd2MzEuODU2Yy0xNy4wNTMsNS4yNzktMjkuODM5LDIwLjM1Ni0zMS43NSwzOC42MjNoLTIuOTQyCgkJCWMtMTEuMjk0LDAtMjAuNDgzLDkuMTg5LTIwLjQ4MywyMC40ODNzOS4xODksMjAuNDgzLDIwLjQ4MywyMC40ODNoNDQyLjg5NGMxMS4yOTQsMCwyMC40ODMtOS4xODksMjAuNDgzLTIwLjQ4MwoJCQlDNDk3LjkyNyw0ODAuMjIzLDQ4OC43MzgsNDcxLjAzNCw0NzcuNDQ0LDQ3MS4wMzR6IE0yMzkuMzMzLDI2LjQ2YzAtMC4wMDEsMC4wMDEtMC4wMDEsMC4wMDEtMC4wMDFsMy4wODktNC42MjcKCQkJYzMuMDM0LTQuNTQ1LDguMTA5LTcuMjU4LDEzLjU3NC03LjI1OGM1LjQ2NSwwLDEwLjU0LDIuNzEzLDEzLjU3NCw3LjI1OWw0OC4yNzgsNzIuMzA4aC01LjIwMmwtNDYuMTAzLTY5LjA1MwoJCQljLTIuMzU4LTMuNTMxLTYuMy01LjYzOS0xMC41NDYtNS42MzljLTQuMjQ2LDAtOC4xODksMi4xMDgtMTAuNTQ2LDUuNjM5TDE5OS4zNDcsOTQuMTRoLTUuMjAybDguNzc4LTEzLjE0OEwyMzkuMzMzLDI2LjQ2egoJCQkgTTI5NS4xMjQsOTQuMTRIMjE2Ljg3bDM5LjEyNy01OC42MDRMMjk1LjEyNCw5NC4xNHogTTc5LjgxNiwyOS43aDEzOS44MzFMMjA5LjUxLDQ0Ljg4M0wxNzYuNjIyLDk0LjE0SDYzLjA4MUw3OS44MTYsMjkuN3oKCQkJIE02MC45NDgsMTE0LjgwOXYtNi4wOTZoMzkwLjA5OHY2LjA5Nkg2MC45NDh6IE00MjguMTc5LDEyOS4zODJ2MTQzLjIzM0g4My44MTVWMTI5LjM4Mkg0MjguMTc5eiBNNjcuMTA0LDI5NC4wMTQKCQkJYy0xLjg4MSwwLTMuNDEyLTEuNTMxLTMuNDEyLTMuNDEzYzAtMS44ODEsMS41My0zLjQxMiwzLjQxMi0zLjQxMkg0NDQuODljMS44ODEsMCwzLjQxMiwxLjUzMSwzLjQxMiwzLjQxMgoJCQljMCwxLjg4Mi0xLjUzLDMuNDEzLTMuNDEyLDMuNDEzSDY3LjEwNHogTTM2MC40MTYsNDcwLjg5M2MwLjMxNy0wLjE4NywwLjYzOC0wLjM2OCwwLjk2Ny0wLjUzNQoJCQljMC4xNTYtMC4wNzksMC4zMTYtMC4xNDksMC40NzQtMC4yMjNjMC4yOC0wLjEzMSwwLjU2Mi0wLjI1NiwwLjg1LTAuMzcxYzAuMTgzLTAuMDczLDAuMzY4LTAuMTQyLDAuNTUzLTAuMjA4CgkJCWMwLjI3Mi0wLjA5OCwwLjU0Ny0wLjE4NywwLjgyNC0wLjI3MWMwLjIwMS0wLjA2LDAuNDAyLTAuMTIxLDAuNjA1LTAuMTc0YzAuMjc2LTAuMDcyLDAuNTU2LTAuMTMyLDAuODM2LTAuMTkKCQkJYzAuMjA3LTAuMDQzLDAuNDExLTAuMDkxLDAuNjItMC4xMjZjMC4zNTYtMC4wNiwwLjcxOC0wLjEwMiwxLjA4MS0wLjEzOWMwLjE3Ni0wLjAxOCwwLjM1Mi0wLjAzOSwwLjUyOS0wLjA1MgoJCQljMC40NDYtMC4wMzEsMC44OTYtMC4wNDcsMS4zNS0wLjA0M2MwLjMzNywwLjAwMywwLjY3OSwwLjAzMiwxLjAyLDAuMDU2YzAuMjM0LDAuMDE2LDAuNDY3LDAuMDIsMC43MDIsMC4wNDYKCQkJYzAuNTcyLDAuMDY1LDEuMTQ2LDAuMTU1LDEuNzE5LDAuMjc5YzMuNTA5LDAuNzU2LDcuMDQ3LTEuMTU1LDguMzM3LTQuNTA3YzQuMDkyLTEwLjYzOSwxNC40OTYtMTcuNzg3LDI1Ljg5MS0xNy43ODcKCQkJYzcuOTUsMCwxNS41MzMsMy40MjgsMjAuODA2LDkuNDA2YzAuMjEsMC4yMzgsMC40MzMsMC40NiwwLjY2OSwwLjY2NmMwLjAxMywwLjAxMSwwLjAyOCwwLjAyLDAuMDQxLDAuMDMyCgkJCWMwLjkzMiwwLjgwNCwyLjA0MywxLjM1NSwzLjIzLDEuNjA4YzAuOTAzLDAuMTkzLDEuODQ4LDAuMjE2LDIuNzg3LDAuMDUxYzEwLjQxNi0xLjgzMSwxOS45NjQsMy44NjgsMjMuOTIyLDEyLjYyNGgtOTguMDYxCgkJCUMzNjAuMjUsNDcwLjk4NSwzNjAuMzM0LDQ3MC45NDIsMzYwLjQxNiw0NzAuODkzeiBNMjkxLjAzOCwzNDcuODE1djEyMy4yMTloLTcwLjA4MlYzNDcuODE1SDI5MS4wMzh6IE03Ny43OTcsNDQ1LjM1MgoJCQljMC43NjctMC4xMjEsMS41MzYtMC4yMTUsMi4zMDUtMC4yNzljMC4wNjYtMC4wMDUsMC4xMzItMC4wMDksMC4xOTgtMC4wMTRjMC43ODQtMC4wNiwxLjU2Ny0wLjA5NiwyLjM0My0wLjA5NgoJCQljMTAuNjg5LDAsMjAuNDY1LDUuNDI0LDI2LjE1LDE0LjUwOWMxLjE4OCwxLjg5OSwzLjE4NSwzLjE0Nyw1LjQxNCwzLjM4MWMwLjUyMywwLjA1NSwxLjAzOCwwLjEzNSwxLjU0OSwwLjIyNgoJCQljMC4xMTUsMC4wMiwwLjIzLDAuMDQxLDAuMzQ1LDAuMDYzYzAuNSwwLjA5NywwLjk5NSwwLjIwOCwxLjQ4MywwLjMzOGMwLjA2MywwLjAxNywwLjEyNSwwLjAzNywwLjE4OSwwLjA1NQoJCQljMC40NDQsMC4xMjMsMC44ODEsMC4yNjEsMS4zMTMsMC40MTFjMC4wOTksMC4wMzQsMC4xOTksMC4wNjcsMC4yOTgsMC4xMDNjMC40NjcsMC4xNjksMC45MjcsMC4zNTMsMS4zNzksMC41NTMKCQkJYzAuMDg4LDAuMDM5LDAuMTc1LDAuMDgxLDAuMjYzLDAuMTIyYzAuNDAzLDAuMTg1LDAuOCwwLjM4LDEuMTksMC41ODhjMC4wNzQsMC4wMzksMC4xNDgsMC4wNzYsMC4yMjIsMC4xMTYKCQkJYzAuNDMxLDAuMjM2LDAuODUyLDAuNDg4LDEuMjY1LDAuNzUyYzAuMDk0LDAuMDYsMC4xODcsMC4xMjIsMC4yOCwwLjE4NGMwLjM4OCwwLjI1NywwLjc2OSwwLjUyMywxLjEzOSwwLjgwMwoJCQljMC4wMzIsMC4wMjQsMC4wNjYsMC4wNDcsMC4wOTgsMC4wNzJjMC4zOTIsMC4zLDAuNzcsMC42MTcsMS4xNDEsMC45NDNjMC4wODcsMC4wNzcsMC4xNzQsMC4xNTQsMC4yNiwwLjIzMgoJCQljMC4zNjUsMC4zMzEsMC43MjIsMC42NzEsMS4wNjQsMS4wMjdjMC4wMjksMC4wMywwLjA1NiwwLjA2MiwwLjA4NCwwLjA5MmMwLjMxOSwwLjMzNiwwLjYyNSwwLjY4MywwLjkyMywxLjAzOQoJCQljMC4wNzIsMC4wODYsMC4xNDUsMC4xNzIsMC4yMTYsMC4yNmMwLjA1MywwLjA2NiwwLjEwMSwwLjEzNiwwLjE1NCwwLjIwMkg1Mi4xODFDNTQuMjI5LDQ1Ny44NjgsNjQuNjQzLDQ0Ny40MzksNzcuNzk3LDQ0NS4zNTJ6CgkJCSBNNDc3LjQ0NCw0OTcuNDI3SDM0LjU1Yy0zLjI1OSwwLTUuOTEtMi42NTEtNS45MS01LjkxYzAtMy4yNTksMi42NTEtNS45MSw1LjkxLTUuOTFoNDQyLjg5NGMzLjI1OSwwLDUuOTEsMi42NTEsNS45MSw1LjkxCgkJCUM0ODMuMzU0LDQ5NC43NzYsNDgwLjcwMyw0OTcuNDI3LDQ3Ny40NDQsNDk3LjQyN3oiLz4KICAgICAgICA8cGF0aCBvcGFjaXR5PSIwLjI1IiAgZD0iTTE4Ni4yMTMsMjMxLjU3MmgtMy4zMzh2LTY1Ljc0NmMwLTUuNzI0LTQuNjU3LTEwLjM4LTEwLjM4LTEwLjM4aC01OS4zNTZjLTUuNzI0LDAtMTAuMzgsNC42NTctMTAuMzgsMTAuMzh2NjUuNzQ2CgkJCWgtMy4zMzdjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODdjMC4wMDEsNC4wMjQsMy4yNjMsNy4yODcsNy4yODgsNy4yODdoODYuNzljNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDMTkzLjUsMjM0LjgzNSwxOTAuMjM4LDIzMS41NzIsMTg2LjIxMywyMzEuNTcyeiBNMTY4LjMwMywyMzEuNTczaC01MC45N3YtNjEuNTU0aDUwLjk3VjIzMS41NzN6Ii8+CiAgICAgICAgPHBhdGggb3BhY2l0eT0iMC4yNSIgIGQ9Ik0yOTkuNjY4LDIzMS41NzJoLTMuMzM4di02NS43NDZjMC01LjcyNC00LjY1Ny0xMC4zOC0xMC4zOC0xMC4zOGgtNTkuMzU1Yy01LjcyNCwwLTEwLjM4LDQuNjU3LTEwLjM4LDEwLjM4djY1Ljc0NgoJCQloLTMuMzM4Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3YzAuMDAxLDQuMDI0LDMuMjYzLDcuMjg3LDcuMjg3LDcuMjg3aDg2Ljc5MWM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3CgkJCUMzMDYuOTU1LDIzNC44MzUsMzAzLjY5MywyMzEuNTcyLDI5OS42NjgsMjMxLjU3MnogTTI4MS43NTgsMjMxLjU3M2gtNTAuOTd2LTYxLjU1NGg1MC45N1YyMzEuNTczeiIvPgogICAgICAgIDxwYXRoIG9wYWNpdHk9IjAuMjUiICBkPSJNNDEyLjU3MiwyMzEuNTcyaC0zLjMzOHYtNjUuNzQ2YzAtNS43MjQtNC42NTctMTAuMzgtMTAuMzc5LTEwLjM4aC01OS4zNTZjLTUuNzI0LDAtMTAuMzgsNC42NTctMTAuMzgsMTAuMzh2NjUuNzQ2CgkJCWgtMy4zMzhjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODdjMCw0LjAyNCwzLjI2Miw3LjI4Nyw3LjI4Nyw3LjI4N2g4Ni43OTFjNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDNDE5Ljg1OSwyMzQuODM1LDQxNi41OTcsMjMxLjU3Miw0MTIuNTcyLDIzMS41NzJ6IE0zOTQuNjYxLDIzMS41NzNoLTUwLjk3di02MS41NTRoNTAuOTdWMjMxLjU3M3oiLz4KICAgICAgICA8cGF0aCBkPSJNMTgyLjgxMyw0MTMuODMzaC0wLjUyOHYtNjAuMDQ1YzAtNS41NjYtNC41MjktMTAuMDk1LTEwLjA5NS0xMC4wOTVoLTUzLjg4NmMtNS41NjYsMC0xMC4wOTUsNC41MjktMTAuMDk1LDEwLjA5NXY2MC4wNDUKCQkJaC0wLjUyOGMtNC4wMjUsMC03LjI4NywzLjI2Mi03LjI4Nyw3LjI4N2MwLDQuMDI1LDMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3aDcuODE0aDU5LjUwNGg3LjgxNGM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3CgkJCUMxOTAuMSw0MTcuMDk1LDE4Ni44MzgsNDEzLjgzMywxODIuODEzLDQxMy44MzN6IE0xNjcuNzEyLDQxMy44MzNoLTQ0LjkzMXYtNTUuNTY3aDQ0LjkzMVY0MTMuODMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik00MDQuMzE0LDQxMy44MzNoLTAuNTI4di02MC4wNDVjMC01LjU2Ni00LjUyOS0xMC4wOTUtMTAuMDk1LTEwLjA5NWgtNTMuODg2Yy01LjU2NiwwLTEwLjA5Niw0LjUyOS0xMC4wOTYsMTAuMDk1djYwLjA0NQoJCQloLTAuNTI4Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3YzAsNC4wMjUsMy4yNjIsNy4yODcsNy4yODcsNy4yODdoNy44MTRIMzk2LjVoNy44MTRjNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDNDExLjYwMSw0MTcuMDk1LDQwOC4zMzksNDEzLjgzMyw0MDQuMzE0LDQxMy44MzN6IE0zODkuMjEzLDQxMy44MzNoLTQ0LjkzMnYtNTUuNTY3aDQ0LjkzMlY0MTMuODMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0yNzYuNTQ1LDQwNS4wODljLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODd2MTIuNjNjMCw0LjAyNCwzLjI2Miw3LjI4Nyw3LjI4Nyw3LjI4NwoJCQljNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4N3YtMTIuNjNDMjgzLjgzMiw0MDguMzUyLDI4MC41Nyw0MDUuMDg5LDI3Ni41NDUsNDA1LjA4OXoiLz4KICAgIDwvZz4KPC9zdmc+Cg=="},"native":{},"_id":"enum.rooms.ground_floor","enums":{},"from":"system.adapter.admin.0","user":"system.user.admin","ts":1701564926194}
         * 2023-12-03 01:55:04.175	info	{"type":"enum","common":{"name":{"en":"Ground Floor","ru":"Первый этаж","de":"Erdgeschoss","fr":"Rez-De-Chaussée","it":"Piano Terra","nl":"Begane Grond","pl":"Parter","pt":"Térreo","es":"Planta Baja","zh-cn":"一楼"},"color":"","desc":"","members":["0_userdata.0.Lampe.level_dimmer"],"icon":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiPgogICAgPGcgZmlsbD0iY3VycmVudENvbG9yIj4KICAgICAgICA8cGF0aCBzdHJva2U9IiIgZD0iTTQ3Ny40NDQsNDcxLjAzNGgtMy44MzNjLTMuNjc5LTE0LjQzNS0xNS45MjYtMjUuMzU2LTMwLjg1OS0yNy4yNDFWMzA4LjU4N2gyLjEzOGM5LjkxNywwLDE3Ljk4NS04LjA2OCwxNy45ODUtMTcuOTg2CgkJCWMwLTkuOTE3LTguMDY4LTE3Ljk4NS0xNy45ODUtMTcuOTg1aC0yLjEzOFYxMjkuMzgyaDkuODE1YzcuMTk3LDAsMTMuMDUyLTUuODU1LDEzLjA1Mi0xMy4wNTJ2LTE0LjkwNAoJCQljMC0wLjAzMy0wLjAwNS0wLjA2NS0wLjAwNS0wLjA5OGMtMC4wMDEtMC4wOTgtMC4wMDktMC4xOTYtMC4wMTUtMC4yOTRjLTAuMDA5LTAuMTcxLTAuMDIxLTAuMzQyLTAuMDQyLTAuNTEKCQkJYy0wLjAxMS0wLjA4OS0wLjAyNi0wLjE3Ny0wLjA0MS0wLjI2NmMtMC4wMjktMC4xODMtMC4wNjUtMC4zNjQtMC4xMDgtMC41NDJjLTAuMDEtMC4wNC0wLjAxNC0wLjA4MS0wLjAyNC0wLjEyMUw0NDYuMTIzLDI1LjQyCgkJCWMtMS41NzQtNi4wNi03LjA0Ny0xMC4yOTMtMTMuMzA3LTEwLjI5M2gtNDkuMTA1Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3czMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3aDQ4LjQ2OGwxNi43MzQsNjQuNDQKCQkJSDMzNS4zNzJMMjkyLjM0NywyOS43aDQ1Ljg2NmM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3YzAtNC4wMjUtMy4yNjItNy4yODctNy4yODctNy4yODdoLTU1LjU5NmwtMC45MjYtMS4zODcKCQkJQzI3NS45NDgsNS4xMzcsMjY2LjM0MiwwLDI1NS45OTcsMGMtMTAuMzQ1LDAtMTkuOTUsNS4xMzYtMjUuNjk0LDEzLjczOWwtMC45MjcsMS4zODhINzkuMTc4CgkJCWMtNi4yNjEsMC0xMS43MzMsNC4yMzItMTMuMzA3LDEwLjI5M0w0Ni42MDksOTkuNTk1Yy0wLjAxLDAuMDQtMC4wMTQsMC4wODEtMC4wMjQsMC4xMjFjLTAuMDQzLDAuMTc4LTAuMDc5LDAuMzU5LTAuMTA4LDAuNTQyCgkJCWMtMC4wMTQsMC4wODktMC4wMywwLjE3Ny0wLjA0MSwwLjI2NmMtMC4wMjEsMC4xNjgtMC4wMzMsMC4zMzgtMC4wNDIsMC41MWMtMC4wMDUsMC4wOTgtMC4wMTQsMC4xOTYtMC4wMTUsMC4yOTQKCQkJYzAsMC4wMzMtMC4wMDUsMC4wNjUtMC4wMDUsMC4wOTh2MTQuOTA0YzAsNy4xOTcsNS44NTUsMTMuMDUyLDEzLjA1MiwxMy4wNTJoOS44MTV2MTQzLjIzM2gtMi4xMzgKCQkJYy05LjkxNywwLTE3Ljk4NSw4LjA2OC0xNy45ODUsMTcuOTg1czguMDY4LDE3Ljk4NiwxNy45ODUsMTcuOTg2aDIuMTM4djQ2LjY5NmMwLDQuMDI0LDMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3CgkJCXM3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4N3YtNDYuNjk2aDM0NC4zNjR2MTI5LjMxMWMtMC4wNTUtMC4wMzItMC4xMTMtMC4wNi0wLjE2OS0wLjA5MmMtMC43MTQtMC40MTUtMS40MzktMC44MS0yLjE3Ni0xLjE4MgoJCQljLTAuMTQ0LTAuMDczLTAuMjkxLTAuMTM5LTAuNDM1LTAuMjFjLTAuNjE0LTAuMzAyLTEuMjM1LTAuNTg4LTEuODYzLTAuODU5Yy0wLjIxMy0wLjA5Mi0wLjQyNS0wLjE4My0wLjYzOS0wLjI3MgoJCQljLTAuNzI3LTAuMy0xLjQ1OS0wLjU4NS0yLjIwMi0wLjg0NGMtMC4wNDQtMC4wMTUtMC4wODctMC4wMzMtMC4xMzEtMC4wNDljLTAuNzg0LTAuMjcxLTEuNTc4LTAuNTExLTIuMzc4LTAuNzM2CgkJCWMtMC4yMTktMC4wNjItMC40NC0wLjExOC0wLjY2LTAuMTc2Yy0wLjY0Mi0wLjE2OS0xLjI4OS0wLjMyMy0xLjk0LTAuNDYyYy0wLjE4OC0wLjA0LTAuMzc1LTAuMDg1LTAuNTY0LTAuMTIzCgkJCWMtMC44MTItMC4xNjItMS42MjktMC4zLTIuNDUxLTAuNDE0Yy0wLjE3OC0wLjAyNS0wLjM1OC0wLjA0Mi0wLjUzNy0wLjA2NGMtMC42NzEtMC4wODQtMS4zNDUtMC4xNTItMi4wMjItMC4yMDQKCQkJYy0wLjIzNC0wLjAxOC0wLjQ2OC0wLjAzNi0wLjcwMi0wLjA1MWMtMC44NDItMC4wNTEtMS42ODUtMC4wODUtMi41MzMtMC4wODVjLTE1LjQ0NiwwLTI5LjY5OSw4LjYxLTM3LjA2MiwyMS45MTUKCQkJYy0wLjg0Ni0wLjAyLTEuNjg0LDAuMDAxLTIuNTE2LDAuMDQ2Yy0wLjE5NSwwLjAxMS0wLjM4NywwLjAzNC0wLjU4MSwwLjA0OGMtMC42MzYsMC4wNDctMS4yNjgsMC4xMDctMS44OTQsMC4xOQoJCQljLTAuMjMsMC4wMzEtMC40NTgsMC4wNzEtMC42ODYsMC4xMDdjLTAuNTg2LDAuMDkyLTEuMTY4LDAuMTk3LTEuNzQ0LDAuMzIxYy0wLjIzNCwwLjA1LTAuNDY1LDAuMTA0LTAuNjk3LDAuMTU5CgkJCWMtMC41NzEsMC4xMzctMS4xMzUsMC4yODktMS42OTUsMC40NTdjLTAuMjE3LDAuMDY1LTAuNDM1LDAuMTI4LTAuNjUsMC4xOThjLTAuNTg4LDAuMTktMS4xNjcsMC40LTEuNzQsMC42MjQKCQkJYy0wLjE3MSwwLjA2Ny0wLjM0NSwwLjEyNy0wLjUxNSwwLjE5N2MtMC43MDUsMC4yOS0xLjM5OSwwLjYwMi0yLjA3OSwwLjk0MWMtMC4wMjgsMC4wMTQtMC4wNTgsMC4wMjYtMC4wODYsMC4wNAoJCQljLTAuNzMzLDAuMzY5LTEuNDUsMC43NjYtMi4xNSwxLjE5Yy0wLjA2NiwwLjA0LTAuMTI5LDAuMDg2LTAuMTk1LDAuMTI3Yy0wLjYsMC4zNy0xLjE4NywwLjc1OS0xLjc2LDEuMTY5CgkJCWMtMC4xODQsMC4xMzItMC4zNjEsMC4yNzItMC41NDIsMC40MDhjLTAuNDQ3LDAuMzM1LTAuODg4LDAuNjc3LTEuMzE2LDEuMDM2Yy0wLjIwNiwwLjE3Mi0wLjQwNywwLjM1MS0wLjYwOSwwLjUyOQoJCQljLTAuMzkxLDAuMzQ1LTAuNzc0LDAuNjk4LTEuMTQ4LDEuMDYzYy0wLjIwMSwwLjE5Ni0wLjQwMSwwLjM5NC0wLjU5NywwLjU5NmMtMC4zNjUsMC4zNzYtMC43MTcsMC43NjMtMS4wNjQsMS4xNTgKCQkJYy0wLjE3OCwwLjIwMy0wLjM1OSwwLjQwNC0wLjUzMywwLjYxMmMtMC4zNjcsMC40NDEtMC43MTcsMC44OTctMS4wNiwxLjM1OWMtMC4xMzEsMC4xNzYtMC4yNjksMC4zNDYtMC4zOTYsMC41MjUKCQkJYy0wLjg4NSwxLjI0Ni0xLjY4OSwyLjU2LTIuMzkyLDMuOTQ0aC0zNS40NTdWMzQ2LjE4MWMwLTcuMTM1LTUuODA1LTEyLjkzOS0xMi45MzktMTIuOTM5aC03My4zNDkKCQkJYy03LjEzNSwwLTEyLjkzOSw1LjgwNS0xMi45MzksMTIuOTM5djEyNC44NTNoLTYwLjYzOWMtMC4xODgtMC40NjktMC4zOTktMC45MjUtMC42MDUtMS4zODMKCQkJYy0wLjA4OC0wLjE5NC0wLjE2Ni0wLjM5NC0wLjI1Ni0wLjU4NmMtMC4zNTMtMC43NDktMC43MjgtMS40ODMtMS4xMjgtMi4yMDJjLTAuMDc1LTAuMTM1LTAuMTYtMC4yNjMtMC4yMzYtMC4zOTcKCQkJYy0wLjMzMS0wLjU3Ny0wLjY3My0xLjE0Ny0xLjAzNC0xLjcwM2MtMC4xNTEtMC4yMzItMC4zMTEtMC40NTYtMC40NjctMC42ODVjLTAuMzA1LTAuNDQ4LTAuNjE2LTAuODkxLTAuOTQtMS4zMjQKCQkJYy0wLjE4My0wLjI0NS0wLjM3Mi0wLjQ4NC0wLjU2Mi0wLjcyNGMtMC4zMi0wLjQwNS0wLjY0Ni0wLjgwMy0wLjk4Mi0xLjE5M2MtMC4yMDItMC4yMzQtMC40MDUtMC40NjctMC42MTItMC42OTUKCQkJYy0wLjM1Mi0wLjM4OC0wLjcxNC0wLjc2Ni0xLjA4MS0xLjEzOGMtMC4yMDUtMC4yMDctMC40MDctMC40MTctMC42MTYtMC42MmMtMC40MTktMC40MDUtMC44NTItMC43OTQtMS4yOS0xLjE3OAoJCQljLTAuMTcyLTAuMTUxLTAuMzM3LTAuMzA4LTAuNTExLTAuNDU1Yy0wLjYyMi0wLjUyNS0xLjI1OS0xLjAzMS0xLjkxNC0xLjUxM2MtMC4wNjctMC4wNDktMC4xMzctMC4wOTMtMC4yMDQtMC4xNDEKCQkJYy0wLjU4OC0wLjQyNi0xLjE4OC0wLjgzNi0xLjgwMS0xLjIyNmMtMC4yMjUtMC4xNDQtMC40NTgtMC4yNzYtMC42ODYtMC40MTRjLTAuNDY3LTAuMjgzLTAuOTM4LTAuNTYyLTEuNDE4LTAuODI0CgkJCWMtMC4yNy0wLjE0OC0wLjU0NS0wLjI4Ny0wLjgxOS0wLjQyOGMtMC40NTYtMC4yMzQtMC45MTYtMC40NjEtMS4zODMtMC42NzZjLTAuMjktMC4xMzQtMC41ODEtMC4yNjQtMC44NzUtMC4zOTEKCQkJYy0wLjQ3My0wLjIwMy0wLjk1My0wLjM5NC0xLjQzNi0wLjU3OGMtMC4yOTEtMC4xMS0wLjU3OS0wLjIyMy0wLjg3My0wLjMyNmMtMC41MjgtMC4xODYtMS4wNjUtMC4zNTMtMS42MDQtMC41MTQKCQkJYy0wLjI1Ni0wLjA3Ny0wLjUwOC0wLjE2Mi0wLjc2Ni0wLjIzM2MtMC44LTAuMjIxLTEuNjA4LTAuNDIxLTIuNDI4LTAuNTg4Yy0wLjUyNy0wLjcxOC0xLjA3NC0xLjQxOC0xLjYzNy0yLjA5OQoJCQljLTAuMTkzLTAuMjMzLTAuMzk4LTAuNDUyLTAuNTk1LTAuNjgxYy0wLjM3OC0wLjQ0LTAuNzU0LTAuODgyLTEuMTQ3LTEuMzA2Yy0wLjI0Ni0wLjI2NS0wLjUwNS0wLjUxNC0wLjc1Ny0wLjc3MgoJCQljLTAuMzYtMC4zNjktMC43MTYtMC43NDQtMS4wODctMS4xYy0wLjI3Ny0wLjI2NS0wLjU2Ni0wLjUxNC0wLjg0OS0wLjc3MmMtMC4zNjItMC4zMy0wLjcxOS0wLjY2NC0xLjA5MS0wLjk4MQoJCQljLTAuMzAxLTAuMjU3LTAuNjE0LTAuNDk4LTAuOTIxLTAuNzQ3Yy0wLjM2OC0wLjI5OC0wLjczMi0wLjYtMS4xMDgtMC44ODZjLTAuMzIyLTAuMjQ0LTAuNjU0LTAuNDcyLTAuOTgxLTAuNzA3CgkJCWMtMC4zNzYtMC4yNy0wLjc0OS0wLjU0NC0xLjEzMy0wLjgwMWMtMC4zMzktMC4yMjctMC42ODctMC40MzktMS4wMzEtMC42NTdjLTAuMzg3LTAuMjQ1LTAuNzcxLTAuNDkzLTEuMTY0LTAuNzI1CgkJCWMtMC4zNTMtMC4yMDktMC43MTUtMC40MDItMS4wNzQtMC42MDFjLTAuMzk3LTAuMjItMC43OTItMC40NDMtMS4xOTYtMC42NTFjLTAuMzY4LTAuMTktMC43NDItMC4zNjQtMS4xMTUtMC41NDQKCQkJYy0wLjQwNi0wLjE5NS0wLjgxMS0wLjM5My0xLjIyNC0wLjU3NmMtMC4zOC0wLjE2OS0wLjc2NS0wLjMyMy0xLjE1LTAuNDgyYy0wLjQxNy0wLjE3MS0wLjgzMi0wLjM0NC0xLjI1NS0wLjUwMwoJCQljLTAuMzg5LTAuMTQ3LTAuNzg0LTAuMjgtMS4xNzgtMC40MTZjLTAuNDI3LTAuMTQ3LTAuODU0LTAuMjk2LTEuMjg2LTAuNDNjLTAuMzk4LTAuMTI0LTAuODAxLTAuMjM2LTEuMjA0LTAuMzQ5CgkJCWMtMC40MzctMC4xMjMtMC44NzMtMC4yNDYtMS4zMTQtMC4zNTZjLTAuNDA3LTAuMTAxLTAuODE3LTAuMTkxLTEuMjI3LTAuMjgxYy0wLjQ0NS0wLjA5OC0wLjg5LTAuMTk0LTEuMzM4LTAuMjc5CgkJCWMtMC40MTQtMC4wNzgtMC44MzEtMC4xNDUtMS4yNDgtMC4yMTJjLTAuNDUzLTAuMDcyLTAuOTA1LTAuMTQzLTEuMzYxLTAuMjAyYy0wLjQyLTAuMDU0LTAuODQyLTAuMDk4LTEuMjY0LTAuMTQxCgkJCWMtMC40Ni0wLjA0Ny0wLjkyMS0wLjA5LTEuMzg1LTAuMTIyYy0wLjQyNC0wLjAzLTAuODUtMC4wNTEtMS4yNzYtMC4wNjljLTAuMjY5LTAuMDEyLTAuNTM0LTAuMDM2LTAuODA0LTAuMDQzdi0yOS44NTEKCQkJYzAtNC4wMjQtMy4yNjItNy4yODctNy4yODctNy4yODdjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODd2MzEuODU2Yy0xNy4wNTMsNS4yNzktMjkuODM5LDIwLjM1Ni0zMS43NSwzOC42MjNoLTIuOTQyCgkJCWMtMTEuMjk0LDAtMjAuNDgzLDkuMTg5LTIwLjQ4MywyMC40ODNzOS4xODksMjAuNDgzLDIwLjQ4MywyMC40ODNoNDQyLjg5NGMxMS4yOTQsMCwyMC40ODMtOS4xODksMjAuNDgzLTIwLjQ4MwoJCQlDNDk3LjkyNyw0ODAuMjIzLDQ4OC43MzgsNDcxLjAzNCw0NzcuNDQ0LDQ3MS4wMzR6IE0yMzkuMzMzLDI2LjQ2YzAtMC4wMDEsMC4wMDEtMC4wMDEsMC4wMDEtMC4wMDFsMy4wODktNC42MjcKCQkJYzMuMDM0LTQuNTQ1LDguMTA5LTcuMjU4LDEzLjU3NC03LjI1OGM1LjQ2NSwwLDEwLjU0LDIuNzEzLDEzLjU3NCw3LjI1OWw0OC4yNzgsNzIuMzA4aC01LjIwMmwtNDYuMTAzLTY5LjA1MwoJCQljLTIuMzU4LTMuNTMxLTYuMy01LjYzOS0xMC41NDYtNS42MzljLTQuMjQ2LDAtOC4xODksMi4xMDgtMTAuNTQ2LDUuNjM5TDE5OS4zNDcsOTQuMTRoLTUuMjAybDguNzc4LTEzLjE0OEwyMzkuMzMzLDI2LjQ2egoJCQkgTTI5NS4xMjQsOTQuMTRIMjE2Ljg3bDM5LjEyNy01OC42MDRMMjk1LjEyNCw5NC4xNHogTTc5LjgxNiwyOS43aDEzOS44MzFMMjA5LjUxLDQ0Ljg4M0wxNzYuNjIyLDk0LjE0SDYzLjA4MUw3OS44MTYsMjkuN3oKCQkJIE02MC45NDgsMTE0LjgwOXYtNi4wOTZoMzkwLjA5OHY2LjA5Nkg2MC45NDh6IE00MjguMTc5LDEyOS4zODJ2MTQzLjIzM0g4My44MTVWMTI5LjM4Mkg0MjguMTc5eiBNNjcuMTA0LDI5NC4wMTQKCQkJYy0xLjg4MSwwLTMuNDEyLTEuNTMxLTMuNDEyLTMuNDEzYzAtMS44ODEsMS41My0zLjQxMiwzLjQxMi0zLjQxMkg0NDQuODljMS44ODEsMCwzLjQxMiwxLjUzMSwzLjQxMiwzLjQxMgoJCQljMCwxLjg4Mi0xLjUzLDMuNDEzLTMuNDEyLDMuNDEzSDY3LjEwNHogTTM2MC40MTYsNDcwLjg5M2MwLjMxNy0wLjE4NywwLjYzOC0wLjM2OCwwLjk2Ny0wLjUzNQoJCQljMC4xNTYtMC4wNzksMC4zMTYtMC4xNDksMC40NzQtMC4yMjNjMC4yOC0wLjEzMSwwLjU2Mi0wLjI1NiwwLjg1LTAuMzcxYzAuMTgzLTAuMDczLDAuMzY4LTAuMTQyLDAuNTUzLTAuMjA4CgkJCWMwLjI3Mi0wLjA5OCwwLjU0Ny0wLjE4NywwLjgyNC0wLjI3MWMwLjIwMS0wLjA2LDAuNDAyLTAuMTIxLDAuNjA1LTAuMTc0YzAuMjc2LTAuMDcyLDAuNTU2LTAuMTMyLDAuODM2LTAuMTkKCQkJYzAuMjA3LTAuMDQzLDAuNDExLTAuMDkxLDAuNjItMC4xMjZjMC4zNTYtMC4wNiwwLjcxOC0wLjEwMiwxLjA4MS0wLjEzOWMwLjE3Ni0wLjAxOCwwLjM1Mi0wLjAzOSwwLjUyOS0wLjA1MgoJCQljMC40NDYtMC4wMzEsMC44OTYtMC4wNDcsMS4zNS0wLjA0M2MwLjMzNywwLjAwMywwLjY3OSwwLjAzMiwxLjAyLDAuMDU2YzAuMjM0LDAuMDE2LDAuNDY3LDAuMDIsMC43MDIsMC4wNDYKCQkJYzAuNTcyLDAuMDY1LDEuMTQ2LDAuMTU1LDEuNzE5LDAuMjc5YzMuNTA5LDAuNzU2LDcuMDQ3LTEuMTU1LDguMzM3LTQuNTA3YzQuMDkyLTEwLjYzOSwxNC40OTYtMTcuNzg3LDI1Ljg5MS0xNy43ODcKCQkJYzcuOTUsMCwxNS41MzMsMy40MjgsMjAuODA2LDkuNDA2YzAuMjEsMC4yMzgsMC40MzMsMC40NiwwLjY2OSwwLjY2NmMwLjAxMywwLjAxMSwwLjAyOCwwLjAyLDAuMDQxLDAuMDMyCgkJCWMwLjkzMiwwLjgwNCwyLjA0MywxLjM1NSwzLjIzLDEuNjA4YzAuOTAzLDAuMTkzLDEuODQ4LDAuMjE2LDIuNzg3LDAuMDUxYzEwLjQxNi0xLjgzMSwxOS45NjQsMy44NjgsMjMuOTIyLDEyLjYyNGgtOTguMDYxCgkJCUMzNjAuMjUsNDcwLjk4NSwzNjAuMzM0LDQ3MC45NDIsMzYwLjQxNiw0NzAuODkzeiBNMjkxLjAzOCwzNDcuODE1djEyMy4yMTloLTcwLjA4MlYzNDcuODE1SDI5MS4wMzh6IE03Ny43OTcsNDQ1LjM1MgoJCQljMC43NjctMC4xMjEsMS41MzYtMC4yMTUsMi4zMDUtMC4yNzljMC4wNjYtMC4wMDUsMC4xMzItMC4wMDksMC4xOTgtMC4wMTRjMC43ODQtMC4wNiwxLjU2Ny0wLjA5NiwyLjM0My0wLjA5NgoJCQljMTAuNjg5LDAsMjAuNDY1LDUuNDI0LDI2LjE1LDE0LjUwOWMxLjE4OCwxLjg5OSwzLjE4NSwzLjE0Nyw1LjQxNCwzLjM4MWMwLjUyMywwLjA1NSwxLjAzOCwwLjEzNSwxLjU0OSwwLjIyNgoJCQljMC4xMTUsMC4wMiwwLjIzLDAuMDQxLDAuMzQ1LDAuMDYzYzAuNSwwLjA5NywwLjk5NSwwLjIwOCwxLjQ4MywwLjMzOGMwLjA2MywwLjAxNywwLjEyNSwwLjAzNywwLjE4OSwwLjA1NQoJCQljMC40NDQsMC4xMjMsMC44ODEsMC4yNjEsMS4zMTMsMC40MTFjMC4wOTksMC4wMzQsMC4xOTksMC4wNjcsMC4yOTgsMC4xMDNjMC40NjcsMC4xNjksMC45MjcsMC4zNTMsMS4zNzksMC41NTMKCQkJYzAuMDg4LDAuMDM5LDAuMTc1LDAuMDgxLDAuMjYzLDAuMTIyYzAuNDAzLDAuMTg1LDAuOCwwLjM4LDEuMTksMC41ODhjMC4wNzQsMC4wMzksMC4xNDgsMC4wNzYsMC4yMjIsMC4xMTYKCQkJYzAuNDMxLDAuMjM2LDAuODUyLDAuNDg4LDEuMjY1LDAuNzUyYzAuMDk0LDAuMDYsMC4xODcsMC4xMjIsMC4yOCwwLjE4NGMwLjM4OCwwLjI1NywwLjc2OSwwLjUyMywxLjEzOSwwLjgwMwoJCQljMC4wMzIsMC4wMjQsMC4wNjYsMC4wNDcsMC4wOTgsMC4wNzJjMC4zOTIsMC4zLDAuNzcsMC42MTcsMS4xNDEsMC45NDNjMC4wODcsMC4wNzcsMC4xNzQsMC4xNTQsMC4yNiwwLjIzMgoJCQljMC4zNjUsMC4zMzEsMC43MjIsMC42NzEsMS4wNjQsMS4wMjdjMC4wMjksMC4wMywwLjA1NiwwLjA2MiwwLjA4NCwwLjA5MmMwLjMxOSwwLjMzNiwwLjYyNSwwLjY4MywwLjkyMywxLjAzOQoJCQljMC4wNzIsMC4wODYsMC4xNDUsMC4xNzIsMC4yMTYsMC4yNmMwLjA1MywwLjA2NiwwLjEwMSwwLjEzNiwwLjE1NCwwLjIwMkg1Mi4xODFDNTQuMjI5LDQ1Ny44NjgsNjQuNjQzLDQ0Ny40MzksNzcuNzk3LDQ0NS4zNTJ6CgkJCSBNNDc3LjQ0NCw0OTcuNDI3SDM0LjU1Yy0zLjI1OSwwLTUuOTEtMi42NTEtNS45MS01LjkxYzAtMy4yNTksMi42NTEtNS45MSw1LjkxLTUuOTFoNDQyLjg5NGMzLjI1OSwwLDUuOTEsMi42NTEsNS45MSw1LjkxCgkJCUM0ODMuMzU0LDQ5NC43NzYsNDgwLjcwMyw0OTcuNDI3LDQ3Ny40NDQsNDk3LjQyN3oiLz4KICAgICAgICA8cGF0aCBvcGFjaXR5PSIwLjI1IiAgZD0iTTE4Ni4yMTMsMjMxLjU3MmgtMy4zMzh2LTY1Ljc0NmMwLTUuNzI0LTQuNjU3LTEwLjM4LTEwLjM4LTEwLjM4aC01OS4zNTZjLTUuNzI0LDAtMTAuMzgsNC42NTctMTAuMzgsMTAuMzh2NjUuNzQ2CgkJCWgtMy4zMzdjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODdjMC4wMDEsNC4wMjQsMy4yNjMsNy4yODcsNy4yODgsNy4yODdoODYuNzljNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDMTkzLjUsMjM0LjgzNSwxOTAuMjM4LDIzMS41NzIsMTg2LjIxMywyMzEuNTcyeiBNMTY4LjMwMywyMzEuNTczaC01MC45N3YtNjEuNTU0aDUwLjk3VjIzMS41NzN6Ii8+CiAgICAgICAgPHBhdGggb3BhY2l0eT0iMC4yNSIgIGQ9Ik0yOTkuNjY4LDIzMS41NzJoLTMuMzM4di02NS43NDZjMC01LjcyNC00LjY1Ny0xMC4zOC0xMC4zOC0xMC4zOGgtNTkuMzU1Yy01LjcyNCwwLTEwLjM4LDQuNjU3LTEwLjM4LDEwLjM4djY1Ljc0NgoJCQloLTMuMzM4Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3YzAuMDAxLDQuMDI0LDMuMjYzLDcuMjg3LDcuMjg3LDcuMjg3aDg2Ljc5MWM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3CgkJCUMzMDYuOTU1LDIzNC44MzUsMzAzLjY5MywyMzEuNTcyLDI5OS42NjgsMjMxLjU3MnogTTI4MS43NTgsMjMxLjU3M2gtNTAuOTd2LTYxLjU1NGg1MC45N1YyMzEuNTczeiIvPgogICAgICAgIDxwYXRoIG9wYWNpdHk9IjAuMjUiICBkPSJNNDEyLjU3MiwyMzEuNTcyaC0zLjMzOHYtNjUuNzQ2YzAtNS43MjQtNC42NTctMTAuMzgtMTAuMzc5LTEwLjM4aC01OS4zNTZjLTUuNzI0LDAtMTAuMzgsNC42NTctMTAuMzgsMTAuMzh2NjUuNzQ2CgkJCWgtMy4zMzhjLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODdjMCw0LjAyNCwzLjI2Miw3LjI4Nyw3LjI4Nyw3LjI4N2g4Ni43OTFjNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDNDE5Ljg1OSwyMzQuODM1LDQxNi41OTcsMjMxLjU3Miw0MTIuNTcyLDIzMS41NzJ6IE0zOTQuNjYxLDIzMS41NzNoLTUwLjk3di02MS41NTRoNTAuOTdWMjMxLjU3M3oiLz4KICAgICAgICA8cGF0aCBkPSJNMTgyLjgxMyw0MTMuODMzaC0wLjUyOHYtNjAuMDQ1YzAtNS41NjYtNC41MjktMTAuMDk1LTEwLjA5NS0xMC4wOTVoLTUzLjg4NmMtNS41NjYsMC0xMC4wOTUsNC41MjktMTAuMDk1LDEwLjA5NXY2MC4wNDUKCQkJaC0wLjUyOGMtNC4wMjUsMC03LjI4NywzLjI2Mi03LjI4Nyw3LjI4N2MwLDQuMDI1LDMuMjYyLDcuMjg3LDcuMjg3LDcuMjg3aDcuODE0aDU5LjUwNGg3LjgxNGM0LjAyNSwwLDcuMjg3LTMuMjYyLDcuMjg3LTcuMjg3CgkJCUMxOTAuMSw0MTcuMDk1LDE4Ni44MzgsNDEzLjgzMywxODIuODEzLDQxMy44MzN6IE0xNjcuNzEyLDQxMy44MzNoLTQ0LjkzMXYtNTUuNTY3aDQ0LjkzMVY0MTMuODMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik00MDQuMzE0LDQxMy44MzNoLTAuNTI4di02MC4wNDVjMC01LjU2Ni00LjUyOS0xMC4wOTUtMTAuMDk1LTEwLjA5NWgtNTMuODg2Yy01LjU2NiwwLTEwLjA5Niw0LjUyOS0xMC4wOTYsMTAuMDk1djYwLjA0NQoJCQloLTAuNTI4Yy00LjAyNSwwLTcuMjg3LDMuMjYyLTcuMjg3LDcuMjg3YzAsNC4wMjUsMy4yNjIsNy4yODcsNy4yODcsNy4yODdoNy44MTRIMzk2LjVoNy44MTRjNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4NwoJCQlDNDExLjYwMSw0MTcuMDk1LDQwOC4zMzksNDEzLjgzMyw0MDQuMzE0LDQxMy44MzN6IE0zODkuMjEzLDQxMy44MzNoLTQ0LjkzMnYtNTUuNTY3aDQ0LjkzMlY0MTMuODMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0yNzYuNTQ1LDQwNS4wODljLTQuMDI1LDAtNy4yODcsMy4yNjItNy4yODcsNy4yODd2MTIuNjNjMCw0LjAyNCwzLjI2Miw3LjI4Nyw3LjI4Nyw3LjI4NwoJCQljNC4wMjUsMCw3LjI4Ny0zLjI2Miw3LjI4Ny03LjI4N3YtMTIuNjNDMjgzLjgzMiw0MDguMzUyLDI4MC41Nyw0MDUuMDg5LDI3Ni41NDUsNDA1LjA4OXoiLz4KICAgIDwvZz4KPC9zdmc+Cg=="},"native":{},"_id":"enum.rooms.ground_floor","enums":{},"from":"system.adapter.admin.0","user":"system.user.admin","ts":1701564904171}
         */

        // The object has been changed
        this.repository.getLanguage().then((language: ioBroker.Languages) => {
            if (object.type === 'state') {
                const iobObject = mapToIobObject(id, object, language);
                this.coordinator.setObject(iobObject);
            } else if (object.type === 'enum') {
                if (id.startsWith('enum.rooms')) {
                    const iobObject = mapToIobRoom(id, object, language);
                    this.coordinator.setRoom(iobObject);
                }
            }
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
}
