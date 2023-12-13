import { VuiEnum, VuiStateObject, VuiStateValue } from './domain';
import { VisionaryUiCustomProperties } from './visionary-ui-iobroker.repository';

export function mapTranslation(value: ioBroker.StringOrTranslated, language: ioBroker.Languages): string {
    if (typeof value === 'object') {
        return value[language] || value.en;
    }
    return value ?? '';
}

export function mapToVuiStateObject(
    id: string,
    ioBrokerObject: ioBroker.Object,
    language: ioBroker.Languages,
): VuiStateObject {
    const customProperties = findVisionaryCustomProperties(ioBrokerObject);

    console.log(ioBrokerObject.common.role);

    return {
        type: 'state',
        id: id,
        name: mapTranslation(ioBrokerObject.common.name, language),
        displayName: customProperties?.displayName || null,
        description: mapTranslation(ioBrokerObject.common.desc, language),
        role: ioBrokerObject.common.role || 'unknown',
        datatype: ioBrokerObject.common.type,
        iobType: ioBrokerObject.type,
        isWriteable: ioBrokerObject.common.write,
        defaultValue: ioBrokerObject.common.def,
        unit: ioBrokerObject.common.unit,
        customIcon: customProperties?.customIcon || null,
        rank: customProperties?.rank || null,
    };
}

export function mapToIobEnum(id: string, ioBrokerRoom: ioBroker.Object, language: ioBroker.Languages): VuiEnum {
    return {
        id: id,
        type: 'unknown',
        name: mapTranslation(ioBrokerRoom.common.name, language),
        color: ioBrokerRoom.common.color ?? null,
        icon: ioBrokerRoom.common.icon ?? null,
        members: ioBrokerRoom.common.members ?? null,
        children: null,
    };
}

export function findVisionaryCustomProperties(ioBrokerObject: ioBroker.Object): VisionaryUiCustomProperties | null {
    const possibleElements = Object.entries(ioBrokerObject.common.custom ?? {})?.find((entry) =>
        entry[0].startsWith('visionary-ui'),
    );
    return possibleElements ? (possibleElements[1] as VisionaryUiCustomProperties) : null;
}

export function mapToRoomIds(ioBrokerObject: ioBroker.Object): string[] {
    return Object.keys(ioBrokerObject.enums ?? {}).filter((entry) => {
        return entry.startsWith('enum.rooms');
    });
}

export function mapToFunctionIds(ioBrokerObject: ioBroker.Object): string[] {
    return Object.keys(ioBrokerObject.enums ?? {}).filter((entry) => {
        return entry.startsWith('enum.functions');
    });
}

export function mapToVuiStateValue(id: string, state: ioBroker.State): VuiStateValue {
    return {
        type: 'value',
        id: id,
        value: state.val,
        lastChange: state.lc,
    };
}
