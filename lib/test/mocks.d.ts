import { ConnectionMetadata, ItemType, RouteStop } from '../types';
export declare const createFerryStopsArrayMock: (numberOfFerryConnections: number, startPosition: number) => {
    id: string;
    itemType: ItemType;
    lat: number;
    lng: number;
    name: string;
    position: number;
}[];
export declare const createRouteElementsMock: ({ numberOfStops, ferryDeparturePositions, sectionPositions, waypointPositions }: {
    numberOfStops: number;
    ferryDeparturePositions?: number[] | undefined;
    sectionPositions?: number[] | undefined;
    waypointPositions?: number[] | undefined;
}) => {
    id: string;
    itemType: ItemType;
    lat: number;
    lng: number;
    name: string;
}[];
export declare const createRouteStateMock: (routeElemetsInCorrectOrder: RouteStop[]) => {
    id: string;
    position: number;
}[];
export declare const createConnectionsMock: (routeElemetsInCorrectOrder: RouteStop[]) => ConnectionMetadata[];
