import { IobFunction, IobObject, IobRoom, IobState } from './domain';

export async function getLanguage(adapter: ioBroker.Adapter): Promise<ioBroker.Languages> {
    try {
        const languageObject = await adapter.getForeignObjectAsync('system.config');
        if (languageObject && languageObject.common) {
            console.log('System language: ' + languageObject.common.language);
            return languageObject.common.language;
        }
    } catch (err) {}
    return Promise.resolve('en');
}

export function getTranslation(value: ioBroker.StringOrTranslated, language: ioBroker.Languages): string {
    if (typeof value === 'object') {
        return value[language] || value.en;
    }
    return value;
}

export function mapToIobObject(id: string, object: any, language: ioBroker.Languages): IobObject {
    // TODO: type and mapping
    console.log(JSON.stringify(object, null, 2));

    return {
        id: id,
        name: getTranslation(object.common.name, language),
        displayName: 'Hübsche Lampe',
        desc: '',
        role: '',
        datatype: '',
        iobType: '',
        isWriteable: true,
        defaultValue: 0,
        customIcon: '',
        rank: 0,
        functionIds: [], // TODO map enums and filter on functions => map to IDs?
        roomIds: [], // TODO map enums and filter on rooms => map to IDs?
    };
}

export function mapToIobState(id: string, state: any): IobState {
    // TODO: type
    return {
        id: id,
        value: state.val,
        lastChange: state.lc,
    };
}

export async function getRooms(adapter: ioBroker.Adapter, language: ioBroker.Languages): Promise<IobRoom[]> {
    const rooms: IobRoom[] = [];
    try {
        const enums = await adapter.getEnumsAsync(['enum.rooms']);
        if (enums) {
            Object.entries(enums['enum.rooms']).map((enumEntry) => {
                const id = enumEntry[0];
                const currentRoom = enumEntry[1];

                const newRoom: IobRoom = {
                    id: id,
                    name: getTranslation(currentRoom.common.name, language),
                    color: currentRoom.common.color ?? null,
                    icon: currentRoom.common.icon ?? null,
                    children: null,
                };

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

export async function getFunctions(adapter: ioBroker.Adapter, language: ioBroker.Languages): Promise<IobFunction[]> {
    const functions: IobFunction[] = [];
    try {
        const enums = await adapter.getEnumsAsync(['enum.functions']);
        if (enums) {
            Object.entries(enums['enum.functions']).map((enumEntry) => {
                const id = enumEntry[0];
                const currentFunction = enumEntry[1];

                functions.push({
                    id: id,
                    name: getTranslation(currentFunction.common.name, language),
                });
            });
            return functions;
        }
    } catch (err) {}
    return Promise.reject();
}
