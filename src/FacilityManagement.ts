import { Room } from './domain';

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

export async function getRooms(adapter: ioBroker.Adapter, language: ioBroker.Languages): Promise<Room[]> {
    const rooms: Room[] = [];
    try {
        const roomEnums = await adapter.getEnumsAsync(['enum.rooms']);
        if (roomEnums) {
            Object.entries(roomEnums['enum.rooms']).map((enumRoomEntry) => {
                const id = enumRoomEntry[0];
                const currentRoom = enumRoomEntry[1];

                const newRoom: Room = {
                    id: id,
                    name: getTranslation(currentRoom.common.name, language),
                    color: currentRoom.common.color,
                    icon: currentRoom.common.icon,
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

    return Promise.resolve([{ id: 'nix', name: '', icon: '' }]);
}

export async function getFunctions(adapter: ioBroker.Adapter): Promise<any> {
    try {
        const functionEnums = await adapter.getEnumsAsync(['enum.functions']);
        if (functionEnums) {
            return functionEnums;
        }
    } catch (err) {}

    return Promise.resolve([]);
}
