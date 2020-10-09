export declare type RouteState = {
    id: string;
    position: number;
}[];
export declare type ConnectionMetadata = {
    id: string;
    duration: number;
    distance: number;
    polyline: string;
};
export declare type Connection = {
    id: string;
    origin: RouteStop;
    destination: RouteStop;
};
export declare type RouteStop = {
    id: string;
    placeId: string;
    name: string;
    lat: number;
    lng: number;
};
export declare enum RouteUserRole {
    Owner = 0,
    Invited = 1
}
export declare type RouteUser = {
    id: string;
    role: RouteUserRole;
};
