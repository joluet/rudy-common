import { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place } from './types';
export { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place };
export declare const mergeRouteStates: (routeStates: RouteState[]) => RouteState;
export declare const buildConnections: (routeStops: RouteStop[], routeState: RouteState) => Connection[];
