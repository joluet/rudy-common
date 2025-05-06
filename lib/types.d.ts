export declare type RouteState = {
    id: string;
    position: number;
}[];
export declare enum TransitType {
    Ferry = "ferry",
    ToTerminal = "to-terminal",
    FromTerminal = "from-terminal",
    FromAndToTerminal = "from-and-to-terminal"
}
export declare type FerryTerminal = {
    place: {
        type: string;
        location: {
            lat: number;
            lng: number;
        };
        originalLocation?: {
            lat: number;
            lng: number;
        };
        waypoint?: number;
    };
};
export declare type ConnectionMetadata = {
    id: string;
    duration: number;
    distance: number;
    polyline: {
        latitude: number;
        longitude: number;
    }[];
    errorCode?: string | null;
    transitType?: TransitType;
    arrival?: FerryTerminal;
    departure?: FerryTerminal;
    avoidHighways?: boolean;
    avoidTollRoads?: boolean;
    date?: string;
};
export declare type Connection = {
    id: string;
    origin: RouteStop;
    destination: RouteStop;
    transitType?: TransitType;
    avoidHighways?: boolean;
    avoidTollRoads?: boolean;
};
export declare type Photo = {
    uri: string;
    path: string;
    fileName: string;
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
    radius?: string;
    photos?: Photo[];
    date?: string;
    position?: number;
    sectionProperties?: {
        avoidTollRoads?: boolean;
        avoidHighways?: boolean;
        preferFerries?: boolean;
        date?: string;
    } | null;
};
export declare enum ItemType {
    Stop = "Stop",
    Section = "Section",
    Waypoint = "Waypoint",
    FerryTerminalArrival = "FerryTerminalArrival",
    FerryTerminalDeparture = "FerryTerminalDeparture"
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
