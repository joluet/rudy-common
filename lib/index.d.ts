import { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place, Photo, TransitType, FerryTerminal } from './types';
export { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place, Photo, TransitType, FerryTerminal };
export declare const mergeRouteStates: (routeStates: RouteState[]) => RouteState;
export declare const getToFerryTerminalConnectionId: ({ prevStopId, nextStopId, departureTerminalName }: {
    prevStopId: string;
    nextStopId: string;
    departureTerminalName: string;
}) => string;
export declare const buildConnections: (routeStops: RouteStop[], routeState: RouteState) => Connection[];
export declare const calculateMetricsSums: (currentConnections: ConnectionMetadata[], deletedConnections: string[], addedConnections: ConnectionMetadata[]) => {
    duration: number;
    distance: number;
    stopsCount: number;
};
