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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
serverConfig.on("connect", () => {
    const app = express_1.default();
    if (fs_1.default.existsSync(environment_1.ENVIRONMENT === "DEVELOPMENT"
        ? path_1.default.join(__dirname, "public", "build")
        : path_1.default.join(__dirname, "../", "public", "build"))) {
        app.use(express_1.default.static(environment_1.ENVIRONMENT === "DEVELOPMENT"
            ? path_1.default.join(__dirname, "public", "build")
            : path_1.default.join(__dirname, "../", "public", "build")));
    }
    // app.use((req:Request,res:Response,next:NextFunction)=>{
    //   console.log(req);
    // })
    app.use(express_1.default.json({}));
    // console.log("asas");
    app.listen(environment_1.PORT, () => {
        logger_1.default.emit("log", __dirname, "index.js", `Server is running at Port ${environment_1.PORT}`);
        serverConfig.emit("success", app);
    });
});
exports.default = serverConfig;
