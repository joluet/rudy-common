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
    nameOverride?: string;
    address?: string;
    category?: string;
    type?: string;
    lat?: number;
    lng?: number;
    description?: string;
    vagueAddress?: string;
};
export declare enum ItemType {
    Stop = "Stop",
    Section = "Section",
    Waypoint = "Waypoint"
}
export declare enum RouteUserRole {
    Owner = 0,
    Invited = 1
}
export declare type RouteUser = {
    id: string;
    role: RouteUserRole;
    name?: string;
    avatarUrl?: string;
};
export declare type Place = {
    id: string;
    name: string;
    nameOverride?: string;
    address: string | undefined;
    category: string | undefined;
    type: string | undefined;
    lat: number;
    lng: number;
    vagueAddress: string | undefined;
};
export declare type AutosuggestResult = Place & {
    distance: number | undefined;
    rating: number | undefined;
};
export declare type LatLng = {
    latitude: number;
    longitude: number;
};
