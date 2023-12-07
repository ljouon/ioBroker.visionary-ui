import { VuiFunctionCache, VuiRoomCache, VuiStateObjectCache, VuiStateValueCache } from './domain';
import { mapToIobEnum, mapToVuiStateObject, mapToVuiStateValue } from './visionary-ui.mapper';

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

    async getRooms(language: ioBroker.Languages): Promise<VuiRoomCache> {
        return this.adapter.getEnumsAsync('enum.rooms').then((roomEnums) =>
            Object.entries(roomEnums['enum.rooms']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const vuiEnum = mapToIobEnum(entryId, entryElement, language);
                    cache.set({ ...vuiEnum, type: 'room' });
                }
                return cache;
            }, new VuiRoomCache()),
        );
    }

    async getFunctions(language: ioBroker.Languages): Promise<VuiFunctionCache> {
        return this.adapter.getEnumsAsync('enum.functions').then((functionEnums) =>
            Object.entries(functionEnums['enum.functions']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const vuiEnum = mapToIobEnum(entryId, entryElement, language);
                    cache.set({ ...vuiEnum, type: 'function' });
                }
                return cache;
            }, new VuiFunctionCache()),
        );
    }

    async getIoBrokerStateObjects(language: ioBroker.Languages): Promise<VuiStateObjectCache> {
        return this.adapter.getForeignObjectsAsync('*', { type: 'state' }).then((ioBrokerObjects) =>
            Object.entries(ioBrokerObjects).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                // If not deleted
                if (entryElement) {
                    const vuiStateObject = mapToVuiStateObject(entryId, entryElement, language);
                    cache.set(vuiStateObject);
                }
                return cache;
            }, new VuiStateObjectCache()),
        );
    }

    async getIoBrokerStateValues(): Promise<VuiStateValueCache> {
        return this.adapter.getForeignStatesAsync('*', {}).then((ioBrokerStates) =>
            Object.entries(ioBrokerStates).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                // If not deleted
                if (entryElement) {
                    const vuiStateValue = mapToVuiStateValue(entryId, entryElement);
                    cache.set(vuiStateValue);
                }
                return cache;
            }, new VuiStateValueCache()),
        );
    }

    public setVuiStateValue(clientId: string, stateId: string, value: string | number | boolean): void {
        // const user = this.config.defaultUser)
        new Date().getUTCMilliseconds();
        const state = {
            val: value,
            ack: false,
            lc: Date.now(),
        };

        this.adapter.setForeignStateAsync(stateId, state).catch(() => {
            // Send feedback to client?
        });
    }
}
