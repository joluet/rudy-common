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
