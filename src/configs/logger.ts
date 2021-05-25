import EventEmitter from "events";
import { Errback, NextFunction, Response } from "express";

const loggerEvent = new EventEmitter();
loggerEvent.on("log", (workspace, uri, message) => {
  console.log(`[${workspace}] [${uri}] [${message}]`);
});

loggerEvent.on("error", (workspace, uri, message) => {
  console.error(`[${workspace}] [${uri}] [${message}]`);
});

loggerEvent.on("debug", (workspace, uri, message) => {
  console.debug(`[${workspace}] [${uri}] [${message}]`);
});

export default loggerEvent;
