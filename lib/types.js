"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteUserRole = exports.ItemType = exports.TransitType = void 0;
var TransitType;
(function (TransitType) {
    TransitType["Ferry"] = "ferry";
    TransitType["ToTerminal"] = "to-terminal";
    TransitType["FromTerminal"] = "from-terminal";
    TransitType["FromAndToTerminal"] = "from-and-to-terminal";
})(TransitType = exports.TransitType || (exports.TransitType = {}));
var ItemType;
(function (ItemType) {
    ItemType["Stop"] = "Stop";
    ItemType["Section"] = "Section";
    ItemType["Waypoint"] = "Waypoint";
    ItemType["FerryTerminalArrival"] = "FerryTerminalArrival";
    ItemType["FerryTerminalDeparture"] = "FerryTerminalDeparture";
    ItemType["FerryTerminalTransit"] = "FerryTerminalTransit";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
var RouteUserRole;
(function (RouteUserRole) {
    RouteUserRole[RouteUserRole["Owner"] = 0] = "Owner";
    RouteUserRole[RouteUserRole["Invited"] = 1] = "Invited";
})(RouteUserRole = exports.RouteUserRole || (exports.RouteUserRole = {}));
//# sourceMappingURL=types.js.map