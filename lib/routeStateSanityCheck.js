"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHasValidFerryConnections = exports.checkEveryStopHasAtLeastOneConnectionConnectingIt = exports.checkEveryConnectionConsistsOfTwoExistingRouteElements = exports.checkEveryStateElementMatchesARouteElement = exports.checkRouteStateHasNoHoles = exports.checkNumberOfConnectionsMatchesRouteElementsNumber = exports.checkNumberOfRouteStateElementsEqualRouteElementNumber = void 0;
const types_1 = require("./types");
exports.checkNumberOfRouteStateElementsEqualRouteElementNumber = ({ routeState, routeElements }) => routeState.length === routeElements.length;
exports.checkNumberOfConnectionsMatchesRouteElementsNumber = ({ routeElements, connections }) => {
    const routeElementsWithoutSections = routeElements.filter(({ itemType }) => itemType !== types_1.ItemType.Section);
    return connections.length === routeElementsWithoutSections.length - 1;
};
exports.checkRouteStateHasNoHoles = ({ routeState }) => routeState
    .sort((a, b) => (a.position > b.position ? 1 : -1))
    .reduce((result, { position }, index) => result && index === position, true);
exports.checkEveryStateElementMatchesARouteElement = ({ routeState, routeElements }) => routeState.reduce((result, stateElement) => result && routeElements.some((element) => element.id === stateElement.id), true);
exports.checkEveryConnectionConsistsOfTwoExistingRouteElements = ({ routeElements, connections }) => {
    const routeElementsWithoutSections = routeElements.filter(({ itemType }) => itemType !== types_1.ItemType.Section);
    return connections.every((connection) => {
        const [originId, destinationId] = connection.id.split('*');
        const origin = routeElementsWithoutSections.find(({ id }) => id === originId);
        const destination = routeElementsWithoutSections.find(({ id }) => id === destinationId);
        return !!origin && !!destination;
    });
};
exports.checkEveryStopHasAtLeastOneConnectionConnectingIt = ({ routeElements, connections }) => {
    const routeElementsWithoutSections = routeElements.filter(({ itemType }) => itemType !== types_1.ItemType.Section);
    const stopsWithOneConnection = routeElements.filter((element) => connections.filter((connection) => connection.id.includes(element.id))
        .length === 1);
    const stopsWithTwoConnections = routeElements.filter((element) => connections.filter((connection) => connection.id.includes(element.id))
        .length === 2);
    return (stopsWithOneConnection.length === 2 &&
        stopsWithTwoConnections.length === routeElementsWithoutSections.length - 2);
};
const isTerminalOfValidFerryConnection = ({ terminal, connections }) => {
    const terminalConnections = connections.filter(({ id }) => id.includes(terminal.id));
    if (terminalConnections.length < 2) {
        return false;
    }
    if (terminalConnections.some(({ transitType }) => transitType === undefined)) {
        return false;
    }
    return true;
};
exports.checkHasValidFerryConnections = ({ routeElements, connections }) => routeElements
    .filter(({ itemType }) => itemType === types_1.ItemType.FerryTerminalDeparture ||
    itemType === types_1.ItemType.FerryTerminalArrival)
    .reduce((result, terminal) => result && isTerminalOfValidFerryConnection({ terminal, connections }), true);
//# sourceMappingURL=routeStateSanityCheck.js.map