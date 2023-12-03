import { IobFunctionCache, IobObjectCache, IobRoomCache, IobStateCache } from './domain';
import { mapToIobFunction, mapToIobObject, mapToIobRoom, mapToIobState } from './visionary-ui.mapper';

export type VisionaryUiCustomProperties = {
    enabled: boolean;
    customIcon: string;
    displayName: string;
    rank: number;
};

export class VisionaryUiIoBrokerRepository {
    private adapter: ioBroker.Adapter;

    constructor(adapter: ioBroker.Adapter) {
        this.adapter = adapter;
    }

    async getLanguage(): Promise<ioBroker.Languages> {
        try {
            const languageObject = await this.adapter.getForeignObjectAsync('system.config');
            if (languageObject && languageObject.common) {
                console.log('System language: ' + languageObject.common.language);
                return languageObject.common.language;
            }
        } catch (err) {}
        return Promise.resolve('en');
    }

    async getRooms(language: ioBroker.Languages): Promise<IobRoomCache> {
        return this.adapter.getEnumsAsync('enum.rooms').then((roomEnums) =>
            Object.entries(roomEnums['enum.rooms']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const iobRoom = mapToIobRoom(entryId, entryElement, language);
                    cache.set(entryId, iobRoom);
                }
                return cache;
            }, new IobRoomCache()),
        );
    }

    async getFunctions(language: ioBroker.Languages): Promise<IobFunctionCache> {
        return this.adapter.getEnumsAsync('enum.functions').then((functionEnums) =>
            Object.entries(functionEnums['enum.functions']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const iobFunction = mapToIobFunction(entryId, entryElement, language);
                    cache.set(entryId, iobFunction);
                }
                return cache;
            }, new IobFunctionCache()),
        );
    }

    async getIoBrokerStateObjects(language: ioBroker.Languages): Promise<IobObjectCache> {
        return this.adapter.getForeignObjectsAsync('*', { type: 'state' }).then((ioBrokerObjects) =>
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

    async getIoBrokerStateValues(): Promise<IobStateCache> {
        return this.adapter.getForeignStatesAsync('*', {}).then((ioBrokerStates) =>
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

    public setIobState(clientId: string, stateId: string, value: string | number | boolean): void {
        // const user = this.config.defaultUser)
        new Date().getUTCMilliseconds();
        const state = {
            val: value,
            ack: false,
            lc: Date.now(),
        };
        this.adapter.getForeignStateAsync(stateId).then((_) => {
            // Send feedback to client?
        });

        this.adapter.setForeignStateAsync(stateId, state).catch(() => {
            // Send feedback to client?
        });
    }
}
