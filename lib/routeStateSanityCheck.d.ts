import { ConnectionMetadata, RouteState, RouteStop } from './types';
export declare const checkNumberOfRouteStateElementsEqualRouteElementNumber: ({ routeState, routeElements }: {
    routeState: RouteState;
    routeElements: RouteStop[];
}) => boolean;
export declare const checkNumberOfConnectionsMatchesRouteElementsNumber: ({ routeElements, connections }: {
    routeElements: RouteStop[];
    connections: ConnectionMetadata[];
}) => boolean;
export declare const checkRouteStateHasNoHoles: ({ routeState }: {
    routeState: RouteState;
}) => boolean;
export declare const checkEveryStateElementMatchesARouteElement: ({ routeState, routeElements }: {
    routeState: RouteState;
    routeElements: RouteStop[];
}) => boolean;
export declare const checkEveryConnectionConsistsOfTwoExistingRouteElements: ({ routeElements, connections }: {
    routeElements: RouteStop[];
    connections: ConnectionMetadata[];
}) => boolean;
export declare const checkEveryStopHasAtLeastOneConnectionConnectingIt: ({ routeElements, connections }: {
    routeElements: RouteStop[];
    connections: ConnectionMetadata[];
}) => boolean;
export declare const checkHasValidFerryConnections: ({ routeElements, connections }: {
    routeElements: RouteStop[];
    connections: ConnectionMetadata[];
}) => boolean;
