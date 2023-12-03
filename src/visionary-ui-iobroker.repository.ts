import { IobFunction, IobRoom } from './domain';
import { mapTranslation } from './visionary-ui.mapper';

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

    async getRooms(language: ioBroker.Languages): Promise<IobRoom[]> {
        const rooms: IobRoom[] = [];
        try {
            const enums = await this.adapter.getEnumsAsync(['enum.rooms']);
            if (enums) {
                Object.entries(enums['enum.rooms']).map((enumEntry) => {
                    const id = enumEntry[0];
                    const currentRoom = enumEntry[1];

                    const newRoom: IobRoom = {
                        id: id,
                        name: mapTranslation(currentRoom.common.name, language),
                        color: currentRoom.common.color ?? null,
                        icon: currentRoom.common.icon ?? null,
                        members: currentRoom.common.members ?? null,
                        children: null,
                    };

                    // Parent klappt, child nicht
                    const parentRoom = rooms.find((existingRooms) => id.startsWith(existingRooms.id));
                    if (parentRoom) {
                        if (!parentRoom.children) {
                            parentRoom.children = [newRoom];
                        } else {
                            parentRoom.children.push(newRoom);
                        }
                    } else {
                        rooms.push(newRoom);
                    }
                });
                return rooms;
            }
        } catch (err) {}
        return Promise.reject();
    }

    async getFunctions(language: ioBroker.Languages): Promise<IobFunction[]> {
        const functions: IobFunction[] = [];
        try {
            const enums = await this.adapter.getEnumsAsync(['enum.functions']);
            if (enums) {
                Object.entries(enums['enum.functions']).map((enumEntry) => {
                    const id = enumEntry[0];
                    const currentFunction = enumEntry[1];

                    functions.push({
                        id: id,
                        name: mapTranslation(currentFunction.common.name, language),
                    });
                });
                return functions;
            }
        } catch (err) {}
        return Promise.reject();
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
