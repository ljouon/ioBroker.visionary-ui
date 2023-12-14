export type VuiEnvelope =
    | AllRooms
    | AllFunctions
    | AllStateObjects
    | AllStateValues
    | OneRoom
    | OneFunction
    | OneStateObject
    | OneStateValue;

export type AllRooms = {
    type: 'allRooms';
    data: VuiRoom[];
};

export type AllFunctions = {
    type: 'allFunctions';
    data: VuiFunction[];
};

export type AllStateObjects = {
    type: 'allStates';
    data: VuiStateObject[];
};

export type AllStateValues = {
    type: 'allValues';
    data: VuiStateValue[];
};

export type OneRoom = {
    type: 'room';
    data: VuiRoom;
};

export type OneFunction = {
    type: 'function';
    data: VuiFunction;
};

export type OneStateObject = {
    type: 'state';
    data: VuiStateObject;
};

export type OneStateValue = {
    type: 'value';
    data: VuiStateValue;
};

export type VuiObject = VuiRoom | VuiFunction | VuiStateObject | VuiStateValue;

export type VuiObjectType = 'room' | 'function' | 'state' | 'value' | 'unknown';

export type WithId = {
    id: string;
};

export type VuiEnum = WithId & {
    id: string;
    type: VuiObjectType;
    name: string;
    color: string | null;
    icon: string | null;
    members: string[] | null;
    children: string[] | null;
};

export type VuiRoom = VuiEnum & {
    type: 'room';
};

export function isRoom(vuiEnum: VuiEnum | null): boolean {
    return vuiEnum?.type === 'room';
}

export function isFunction(vuiEnum: VuiEnum | null): boolean {
    return vuiEnum?.type === 'function';
}

export function hasStateObjects(vuiEnum: VuiEnum | null): boolean {
    return vuiEnum && vuiEnum.members ? vuiEnum.members.length > 0 : false;
}

export type VuiFunction = VuiEnum & {
    type: 'function';
};

interface NumberOrStringDictionary {
    [index: number | string]: number | string;
}

export type VuiStateObject = {
    type: 'state';
    id: string;
    name: string;
    displayName: string | null;
    description: string;
    role: string;
    datatype: string;
    iobType: string;
    isWriteable: boolean;
    defaultValue: string | number | boolean | null;
    minValue: number | null;
    maxValue: number | null;
    step: number | null;
    states: NumberOrStringDictionary | null;
    unit: string;
    customIcon: string | null;
    rank: number | null;
};

export type VuiStateValue = {
    type: 'value';
    id: string;
    value: string | number | boolean | null;
    lastChange: number;
};
