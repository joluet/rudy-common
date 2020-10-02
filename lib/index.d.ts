import { RouteState, RouteStop, Connection, ConnectionMetadata } from './types';
export { RouteState, RouteStop, Connection, ConnectionMetadata };
export declare const mergeRouteStates: (routeStates: RouteState[]) => RouteState;
export declare const buildConnections: (routeStops: RouteStop[], routeState: RouteState) => Connection[];
export declare const calculateMetricsSums: (currentConnections: ConnectionMetadata[], deletedConnections: string[], addedConnections: ConnectionMetadata[]) => {
    duration: number;
    distance: number;
    stopsCount: number;
};
