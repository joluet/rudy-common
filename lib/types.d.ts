export declare type RouteState = {
    id: string;
    position: number;
}[];
export declare type ConnectionMetadata = {
    id: string;
    duration: number;
    distance: number;
    polyline: string;
    errorCode?: string | null;
};
export declare type Connection = {
    id: string;
    origin: RouteStop;
    destination: RouteStop;
};
export declare type RouteStop = {
    id: string;
    placeId?: string;
    itemType: ItemType;
    name: string;
    address?: string;
    category?: string;
    type?: string;
    lat?: number;
    lng?: number;
};
export declare enum ItemType {
    Stop = "Stop",
    Section = "Section"
}
export declare enum RouteUserRole {
    Owner = 0,
    Invited = 1
}
export declare type RouteUser = {
    id: string;
    role: RouteUserRole;
};
export declare type Place = {
    id: string;
    name: string;
    address: string | undefined;
    category: string | undefined;
    type: string | undefined;
    lat: number;
    lng: number;
    vagueAddres: string | undefined;
};
export declare type AutosuggestResult = Place & {
    distance: number | undefined;
};
