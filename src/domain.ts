import { Cache } from './cache';

export type IobRoom = {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
    children: IobRoom[] | null;
};

export type IobFunction = {
    id: string;
    name: string;
};

export type IobRole = {
    id: string;
    name: string;
};

export type IobObject = {
    id: string;
    name: string;
    displayName: string | null;
    desc: string;
    role: string;
    datatype: string;
    iobType: string;
    isWriteable: boolean;
    defaultValue: number;
    customIcon: string | null;
    rank: number | null;
    functionIds: string[];
    roomIds: string[];
};

export type IobState = {
    id: string;
    value: string | number | boolean;
    lastChange: number;
};

export class IobObjectCache extends Cache<IobObject> {}

export class IobStateCache extends Cache<IobState> {}
