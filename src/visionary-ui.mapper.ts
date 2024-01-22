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

    return {
        type: 'state',
        id: id,
        name: mapTranslation(ioBrokerObject.common.name, language),
        displayName: customProperties?.displayName || null,
        description: mapTranslation(ioBrokerObject.common.desc, language),
        role: ioBrokerObject.common.role || 'unknown',
        datatype: ioBrokerObject.common.type,
        iobType: ioBrokerObject.type,
        isWriteable: customProperties?.enabled && customProperties.forceReadOnly ? false : ioBrokerObject.common.write,
        defaultValue: ioBrokerObject.common.def,
        unit: ioBrokerObject.common.unit,
        customIcon: customProperties?.customIcon || null,
        rank: customProperties?.rank || null,
        states: ioBrokerObject.common.states || null,
        minValue: ioBrokerObject.common.min,
        maxValue: ioBrokerObject.common.max,
        step: ioBrokerObject.common.step,
        enabled: (customProperties && customProperties.enabled) || false,
    };
}

export function mapToIobEnum(id: string, ioBrokerObject: ioBroker.Object, language: ioBroker.Languages): VuiEnum {
    const customProperties = findVisionaryCustomProperties(ioBrokerObject);

    return {
        id: id,
        type: 'unknown',
        name: mapTranslation(ioBrokerObject.common.name, language),
        color: ioBrokerObject.common.color ?? null,
        icon: ioBrokerObject.common.icon ?? null,
        members: ioBrokerObject.common.members ?? null,
        children: null,
        customIcon: customProperties?.customIcon || null,
        rank: customProperties?.rank || null,
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
