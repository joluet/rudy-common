import { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place, Photo, TransitType, FerryTerminal } from './types';
export { RouteState, RouteStop, ItemType, Connection, ConnectionMetadata, RouteUserRole, RouteUser, AutosuggestResult, Place, Photo, TransitType, FerryTerminal };
import { createRouteStateMock, createConnectionsMock, createFerryStopsArrayMock, createRouteElementsMock } from './test/mocks';
export { createRouteStateMock, createConnectionsMock, createFerryStopsArrayMock, createRouteElementsMock };
import { checkNumberOfRouteStateElementsEqualRouteElementNumber, checkEveryConnectionConsistsOfTwoExistingRouteElements, checkEveryStateElementMatchesARouteElement, checkEveryStopHasAtLeastOneConnectionConnectingIt, checkHasValidFerryConnections, checkNumberOfConnectionsMatchesRouteElementsNumber, checkRouteStateHasNoHoles } from './routeStateSanityCheck';
export { checkNumberOfRouteStateElementsEqualRouteElementNumber, checkEveryConnectionConsistsOfTwoExistingRouteElements, checkEveryStateElementMatchesARouteElement, checkEveryStopHasAtLeastOneConnectionConnectingIt, checkHasValidFerryConnections, checkNumberOfConnectionsMatchesRouteElementsNumber, checkRouteStateHasNoHoles };
export declare const mergeRouteStates: (routeStates: RouteState[]) => RouteState;
export declare const buildConnections: (routeStops: RouteStop[], routeState: RouteState) => Connection[];
export declare const calculateMetricsSums: (currentConnections: ConnectionMetadata[], deletedConnections: string[], addedConnections: ConnectionMetadata[]) => {
    duration: number;
    distance: number;
    stopsCount: number;
};
