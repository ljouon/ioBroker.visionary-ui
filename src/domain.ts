import { Cache } from './cache';

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

export type WithId = {
    id: string;
};

export type VuiObject = VuiRoom | VuiFunction | VuiStateObject | VuiStateValue;

export type VuiEnum = WithId & {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    members: string[] | null;
    children: string[] | null;
};

export type VuiRoom = VuiEnum & {
    type: 'room';
};

export type VuiFunction = VuiEnum & {
    type: 'function';
};

export type VuiStateObject = {
    type: 'state';
    id: string;
    name: string;
    displayName: string | null;
    desc: string;
    role: string;
    datatype: string;
    iobType: string;
    isWriteable: boolean;
    defaultValue: string | number | boolean | null;
    unit: string;
    customIcon: string | null;
    rank: number | null;
    functionIds: string[];
    roomIds: string[];
};

export type VuiStateValue = {
    type: 'value';
    id: string;
    value: string | number | boolean | null;
    lastChange: number;
};

export class VuiFunctionCache extends Cache<VuiFunction> {}

export class VuiRoomCache extends Cache<VuiRoom> {}

export class VuiStateObjectCache extends Cache<VuiStateObject> {}

export class VuiStateValueCache extends Cache<VuiStateValue> {}
