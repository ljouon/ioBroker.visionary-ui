export type Room = {
    id: string;
    name: string;
    color?: string | undefined;
    icon?: string | undefined;
    children?: Room[] | undefined;
};

export type Function = {
    id: string;
    name: string;
};

export type Role = {
    id: string;
    name: string;
};
