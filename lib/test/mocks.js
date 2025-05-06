"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectionsMock = exports.createRouteStateMock = exports.createRouteElementsMock = exports.createFerryStopsArrayMock = void 0;
const types_1 = require("../types");
exports.createFerryStopsArrayMock = (numberOfFerryConnections, startPosition) => Array.from({ length: numberOfFerryConnections * 2 }, (_, index) => {
    const itemType = index % 2 === 0
        ? types_1.ItemType.FerryTerminalDeparture
        : types_1.ItemType.FerryTerminalArrival;
    const elementIndex = index + startPosition;
    return {
        id: `ferry${elementIndex}`,
        itemType: itemType,
        lat: elementIndex,
        lng: elementIndex,
        name: elementIndex.toString(),
        position: elementIndex
    };
});
exports.createRouteElementsMock = ({ numberOfStops, ferryDeparturePositions, sectionPositions, waypointPositions }) => Array.from({ length: numberOfStops }, (_, index) => {
    let itemType = types_1.ItemType.Stop;
    let id = `stop${index}`;
    if (ferryDeparturePositions === null || ferryDeparturePositions === void 0 ? void 0 : ferryDeparturePositions.includes(index)) {
        itemType = types_1.ItemType.FerryTerminalDeparture;
        id = `ferry${index}`;
    }
    else if (ferryDeparturePositions === null || ferryDeparturePositions === void 0 ? void 0 : ferryDeparturePositions.map((_i) => _i + 1).includes(index)) {
        itemType = types_1.ItemType.FerryTerminalArrival;
        id = `ferry${index}`;
    }
    else if (sectionPositions === null || sectionPositions === void 0 ? void 0 : sectionPositions.includes(index)) {
        itemType = types_1.ItemType.Section;
        id = `section${index}`;
    }
    else if (waypointPositions === null || waypointPositions === void 0 ? void 0 : waypointPositions.includes(index)) {
        itemType = types_1.ItemType.Waypoint;
        id = `waypoint${index}`;
    }
    return {
        id,
        itemType,
        lat: index,
        lng: index,
        name: index.toString()
    };
});
exports.createRouteStateMock = (routeElemetsInCorrectOrder) => routeElemetsInCorrectOrder.map(({ id }, position) => ({
    id,
    position
}));
exports.createConnectionsMock = (routeElemetsInCorrectOrder) => {
    const mock = [];
    routeElemetsInCorrectOrder
        .filter(({ itemType }) => itemType !== types_1.ItemType.Section)
        .forEach((element, index, self) => {
        let transitType = undefined;
        if (element.itemType === types_1.ItemType.FerryTerminalDeparture) {
            transitType = types_1.TransitType.Ferry;
        }
        else if (element.itemType === types_1.ItemType.FerryTerminalArrival) {
            transitType = types_1.TransitType.FromTerminal;
        }
        if (index !== 0) {
            mock[mock.length - 1].id = `${mock[mock.length - 1].id}*${element.id}`;
            if (transitType === types_1.TransitType.Ferry) {
                mock[mock.length - 1].transitType = mock[mock.length - 1].transitType
                    ? types_1.TransitType.FromAndToTerminal
                    : types_1.TransitType.ToTerminal;
            }
        }
        if (index !== self.length - 1) {
            mock.push({
                id: element.id,
                duration: 1,
                distance: 1,
                polyline: [{ latitude: 1, longitude: 1 }],
                transitType
            });
        }
    });
    return mock;
};
//# sourceMappingURL=mocks.js.map