"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const loggerEvent = new events_1.default();
loggerEvent.on("log", (workspace, uri, message) => {
    console.log(`[${workspace}] [${uri}] [${message}]`);
});
loggerEvent.on("error", (workspace, uri, message) => {
    console.error(`[${workspace}] [${uri}] [${message}]`);
});
loggerEvent.on("debug", (workspace, uri, message) => {
    console.debug(`[${workspace}] [${uri}] [${message}]`);
});
exports.default = loggerEvent;
