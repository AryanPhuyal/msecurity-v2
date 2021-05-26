"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cost_route_1 = __importDefault(require("./src/router/cost.route"));
const user_route_1 = __importDefault(require("./src/router/user.route"));
const license_route_1 = __importDefault(require("./src/router/license.route"));
const partner_route_1 = __importDefault(require("./src/router/partner.route"));
const test_route_1 = __importDefault(require("./src/router/test.route"));
const viri_route_1 = __importDefault(require("./src/router/viri.route"));
const auth_middlleware_1 = __importDefault(require("./src/middleware/auth.middlleware"));
const liscenseKey_route_1 = __importDefault(require("./src/router/liscenseKey.route"));
const secret_middleware_1 = __importDefault(require("./src/middleware/secret.middleware"));
const logger_1 = __importDefault(require("./src/configs/logger"));
const cors_1 = __importDefault(require("cors"));
// config app
const dotenv = require("dotenv");
dotenv.config();
//
const configApp_1 = __importDefault(require("./src/configs/configApp"));
const database_1 = __importDefault(require("./src/configs/database"));
database_1.default.emit("connect");
// on connection start listener
database_1.default.on("success", (connection) => {
    configApp_1.default.emit("connect");
    configApp_1.default.on("success", (app) => {
        app.use(cors_1.default());
        app.use(auth_middlleware_1.default);
        app.use(secret_middleware_1.default);
        app.use("/api/user", user_route_1.default);
        app.use("/api/cost", cost_route_1.default);
        app.use("/api/license", license_route_1.default);
        app.use("/api/partner", partner_route_1.default);
        app.use("/api/virus", viri_route_1.default);
        app.use("/test/api", test_route_1.default);
        app.use("/api/key", liscenseKey_route_1.default);
        app.use("/api", errorHandler);
        app.use("/api", (req, res) => {
            res.json({
                success: false,
                message: "Invalid Route",
            });
        });
        app.use("/test/api", (req, res) => {
            res.json({
                success: false,
                message: "Sorry Test for this route is not aviliable",
            });
        });
    });
});
database_1.default.on("error", (err) => {
    // when database cal gets fail
    console.log(err);
});
configApp_1.default.on("err", (err) => {
    // when server creation gets failcons\
    console.log(err);
});
function errorHandler(err, req, res, next) {
    logger_1.default.emit("error", __dirname, "index.js", err.toString());
    if (process.env.ENVIRONMENT === "DEVLOPMENT") {
    }
    if (res.statusCode) {
        res.json({
            success: false,
            error: err,
        });
    }
    else {
        res.statusCode = 500;
        res.json({
            success: false,
            error: err,
        });
    }
}
