import { mapToIobEnum, mapToVuiStateObject, mapToVuiStateValue } from './visionary-ui.mapper';
import { VuiCache } from './visionary-ui.cache';
import { VuiFunction, VuiRoom, VuiStateObject, VuiStateValue } from './domain';
import '@iobroker/types';

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
                return languageObject.common.language;
            }
        } catch (err) {}
        return Promise.resolve('en');
    }

    async getRooms(language: ioBroker.Languages): Promise<VuiCache<VuiRoom>> {
        return this.adapter.getEnumsAsync('enum.rooms').then((roomEnums) =>
            Object.entries(roomEnums['enum.rooms']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const vuiEnum = mapToIobEnum(entryId, entryElement, language);
                    cache.set({ ...vuiEnum, type: 'room' });
                }
                return cache;
            }, new VuiCache<VuiRoom>()),
        );
    }

    async getFunctions(language: ioBroker.Languages): Promise<VuiCache<VuiFunction>> {
        return this.adapter.getEnumsAsync('enum.functions').then((functionEnums) =>
            Object.entries(functionEnums['enum.functions']).reduce((cache, entry) => {
                const entryId = entry[0];
                const entryElement = entry[1];
                if (entryElement) {
                    const vuiEnum = mapToIobEnum(entryId, entryElement, language);
                    cache.set({ ...vuiEnum, type: 'function' });
                }
                return cache;
            }, new VuiCache<VuiFunction>()),
        );
    }

    async getIoBrokerStateObjects(language: ioBroker.Languages): Promise<VuiCache<VuiStateObject>> {
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
            }, new VuiCache<VuiStateObject>()),
        );
    }

    async getIoBrokerStateValues(): Promise<VuiCache<VuiStateValue>> {
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
            }, new VuiCache<VuiStateValue>()),
        );
    }

    public setVuiStateValue(clientId: string, stateId: string, value: string | number | boolean | null): void {
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
