"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMetricsSums = exports.buildConnections = exports.getFromFerryTerminalConnectionId = exports.getFerryConnectionId = exports.getToFerryTerminalConnectionId = exports.mergeRouteStates = exports.RouteUserRole = exports.ItemType = void 0;
const types_1 = require("./types");
Object.defineProperty(exports, "ItemType", { enumerable: true, get: function () { return types_1.ItemType; } });
Object.defineProperty(exports, "RouteUserRole", { enumerable: true, get: function () { return types_1.RouteUserRole; } });
exports.mergeRouteStates = (routeStates) => {
    const mergedState = [...routeStates]
        .reverse()
        .reduce((mergedState, currentState) => {
        const deletedInCurrent = currentState.filter((item) => item.position === -1);
        return mergedState
            .map((item) => {
            if (deletedInCurrent.find((deleted) => item.id === deleted.id)) {
                return Object.assign(Object.assign({}, item), { position: -1 });
            }
            else {
                return item;
            }
        })
            .concat(currentState.filter((item) => !mergedState.some((merged) => merged.id === item.id)));
    }, [])
        .filter((item) => item.position !== -1);
    const sortedMergedState = [...mergedState].sort((a, b) => a.position - b.position);
    const result = sortedMergedState.map((item, index) => (Object.assign(Object.assign({}, item), { position: index })));
    return result;
};
exports.getToFerryTerminalConnectionId = ({ prevStopId, nextStopId, departureTerminalName }) => {
    const trimmedName = departureTerminalName.replace(/ /g, '');
    return `${prevStopId}*${nextStopId}-${trimmedName}`;
};
exports.getFerryConnectionId = ({ prevStopId, nextStopId, departureTerminalName, arrivalTerminalName }) => {
    const trimmedDepartureName = departureTerminalName.replace(/ /g, '');
    const trimmedArrivalName = arrivalTerminalName.replace(/ /g, '');
    return `${prevStopId}*${nextStopId}-${trimmedDepartureName}-${trimmedArrivalName}`;
};
exports.getFromFerryTerminalConnectionId = ({ prevStopId, nextStopId, arrivalTerminalName }) => {
    const trimmedName = arrivalTerminalName.replace(/ /g, '');
    return `${prevStopId}*${nextStopId}-${trimmedName}`;
};
exports.buildConnections = (routeStops, routeState) => {
    let stopPrevieousFerryId = null;
    let nextStopAfterFerryId = null;
    return routeStops
        .filter((stop) => stop.itemType !== types_1.ItemType.Section)
        .filter((stop) => routeState.find((item) => stop.id === item.id))
        .sort((a, b) => {
        const positionA = routeState.find((item) => item.id === a.id).position;
        const positionB = routeState.find((item) => item.id === b.id).position;
        return positionA - positionB;
    })
        .reduce((result, stop, index, array) => {
        if (index < array.length - 1) {
            const origin = stop;
            const destination = array[index + 1];
            if (stop.itemType === 'FerryTerminalDeparture') {
                if (!stopPrevieousFerryId) {
                    stopPrevieousFerryId = array[index - 1].id;
                    result[index - 1].transitType = 'to-terminal';
                }
                else {
                    result[index - 1].transitType = 'from-and-to-terminal';
                }
                if (!nextStopAfterFerryId) {
                    nextStopAfterFerryId = array.slice(index).find((stop) => stop.itemType === types_1.ItemType.Stop).id;
                }
                result.push({
                    id: exports.getFerryConnectionId({
                        prevStopId: stopPrevieousFerryId,
                        nextStopId: nextStopAfterFerryId,
                        departureTerminalName: origin.name,
                        arrivalTerminalName: destination.name
                    }),
                    origin: origin,
                    destination: destination,
                    transitType: 'ferry'
                });
                result[index - 1].id = exports.getToFerryTerminalConnectionId({
                    prevStopId: stopPrevieousFerryId,
                    nextStopId: nextStopAfterFerryId,
                    departureTerminalName: origin.name
                });
            }
            else if (stop.itemType === 'FerryTerminalArrival' && nextStopAfterFerryId && stopPrevieousFerryId) {
                result.push({
                    id: exports.getFromFerryTerminalConnectionId({
                        prevStopId: stopPrevieousFerryId,
                        nextStopId: nextStopAfterFerryId,
                        arrivalTerminalName: origin.name
                    }),
                    origin: origin,
                    destination: destination,
                    transitType: 'from-terminal'
                });
            }
            else {
                result.push({
                    id: `${origin.id}*${destination.id}`,
                    origin: origin,
                    destination: destination,
                });
                stopPrevieousFerryId = null;
                nextStopAfterFerryId = null;
            }
        }
        return result;
    }, []);
};
exports.calculateMetricsSums = (currentConnections, deletedConnections, addedConnections) => {
    const resultingConnections = currentConnections
        .filter((connection) => !deletedConnections.find((deleted) => deleted === connection.id))
        .concat(addedConnections);
    if (resultingConnections.length === 0) {
        return { duration: 0, distance: 0, stopsCount: 0 };
    }
    else {
        return resultingConnections.reduce((sumDurationAndDistance, connection) => ({
            duration: sumDurationAndDistance.duration + connection.duration,
            distance: sumDurationAndDistance.distance + connection.distance,
            stopsCount: sumDurationAndDistance.stopsCount + 1
        }), { duration: 0, distance: 0, stopsCount: 1 });
    }
};
//# sourceMappingURL=index.js.map