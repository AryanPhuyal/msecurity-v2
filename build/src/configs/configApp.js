"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const express_1 = __importDefault(require("express"));
const environment_1 = require("../utility/environment");
const logger_1 = __importDefault(require("./logger"));
const serverConfig = new events_1.default();
serverConfig.on("connect", () => {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.listen(environment_1.PORT, () => {
        logger_1.default.emit("log", __dirname, "index.js", `Server is running at Port ${environment_1.PORT}`);
        serverConfig.emit("success", app);
    });
});
exports.default = serverConfig;
