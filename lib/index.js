"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMetricsSums = exports.buildConnections = exports.mergeRouteStates = exports.TransitType = exports.RouteUserRole = exports.ItemType = void 0;
const types_1 = require("./types");
Object.defineProperty(exports, "ItemType", { enumerable: true, get: function () { return types_1.ItemType; } });
Object.defineProperty(exports, "RouteUserRole", { enumerable: true, get: function () { return types_1.RouteUserRole; } });
Object.defineProperty(exports, "TransitType", { enumerable: true, get: function () { return types_1.TransitType; } });
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
exports.buildConnections = (routeStops, routeState) => {
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
            const prevStop = array.slice(0, index).find((stop) => stop.itemType === types_1.ItemType.Stop);
            const nextStop = array.slice(index + 1).find((stop) => stop.itemType === types_1.ItemType.Stop);
            let element = {
                id: `${origin.id}*${destination.id}`,
                origin: origin,
                destination: destination,
            };
            if (prevStop &&
                nextStop &&
                (origin.itemType === types_1.ItemType.FerryTerminalDeparture)) {
                element = Object.assign(Object.assign({}, element), { transitType: types_1.TransitType.Ferry });
            }
            else if (prevStop && origin.itemType === types_1.ItemType.FerryTerminalArrival) {
                if (nextStop && destination.itemType === types_1.ItemType.FerryTerminalDeparture) {
                    element = Object.assign(Object.assign({}, element), { transitType: types_1.TransitType.FromAndToTerminal });
                }
                else {
                    element = Object.assign(Object.assign({}, element), { transitType: types_1.TransitType.FromTerminal });
                }
            }
            else {
                if (nextStop && destination.itemType === types_1.ItemType.FerryTerminalDeparture) {
                    element = Object.assign(Object.assign({}, element), { transitType: types_1.TransitType.ToTerminal });
                }
            }
            result.push(element);
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