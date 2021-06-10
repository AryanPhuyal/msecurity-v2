"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const cost_route_1 = __importDefault(require("./src/router/cost.route"));
const user_route_1 = __importDefault(require("./src/router/user.route"));
const license_route_1 = __importDefault(require("./src/router/license.route"));
const partner_route_1 = __importDefault(require("./src/router/partner.route"));
const test_route_1 = __importDefault(require("./src/router/test.route"));
const viri_route_1 = __importDefault(require("./src/router/viri.route"));
const auth_middlleware_1 = __importDefault(
  require("./src/middleware/auth.middlleware")
);
const liscenseKey_route_1 = __importDefault(
  require("./src/router/liscenseKey.route")
);
const secret_middleware_1 = __importDefault(
  require("./src/middleware/secret.middleware")
);
const logger_1 = __importDefault(require("./src/configs/logger"));
const licenseunsecure_route_1 = __importDefault(
  require("./src/router/licenseunsecure.route")
);
const costRouteInsecure_route_1 = __importDefault(
  require("./src/router/costRouteInsecure.route")
);
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const environment_1 = require("./src/utility/environment");
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
    if (
      fs_1.default.existsSync(
        environment_1.ENVIRONMENT === "DEVELOPMENT"
          ? path_1.default.join(__dirname, "public", "build")
          : path_1.default.join(__dirname, "../", "public", "build")
      )
    ) {
      app.get("*", (req, res) =>
        res.sendFile(
          path_1.default.resolve(
            environment_1.ENVIRONMENT === "DEVELOPMENT"
              ? path_1.default.join(__dirname, "public", "build", "index.html")
              : path_1.default.join(
                  __dirname,
                  "../",
                  "public",
                  "build",
                  "index.html"
                )
          )
        )
      );
    }
    app.use(auth_middlleware_1.default);
    app.use(secret_middleware_1.default);
    app.use("/api/error", (req, res) => {
      res.statusCode = 400;
      throw "Unable to handel request";
    });
    app.use("/api/v2/user", user_route_1.default);
    app.use("/api/v2/cost", cost_route_1.default);
    app.use("/api/cost", costRouteInsecure_route_1.default);
    app.use("/api/v2/license", license_route_1.default);
    app.use("/api/license", licenseunsecure_route_1.default);
    app.use("/api/v2/partner", partner_route_1.default);
    app.use("/api/v2/virus", viri_route_1.default);
    app.use("/test/api/v2", test_route_1.default);
    app.use("/api/v2/key", liscenseKey_route_1.default);
    app.use("/api/", errorHandler);
    app.use("/test/", errorHandler);
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
});
configApp_1.default.on("err", (err) => {
  // when server creation gets failcons\
});
function errorHandler(err, req, res, next) {
  logger_1.default.emit("error", __dirname, "index.js", err.toString());
  if (process.env.ENVIRONMENT === "DEVLOPMENT") {
  }
  if (err instanceof SyntaxError) {
    res.statusCode = 400;
    return res.json({
      success: false,
      error: "Not a valid json",
    });
  }
  if (res.statusCode) {
    res.json({
      success: false,
      error: err,
    });
  } else {
    res.statusCode = 500;
    res.json({
      success: false,
      error: err,
    });
  }
}
