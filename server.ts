import costRoute from "./src/router/cost.route";
import userRoute from "./src/router/user.route";
import licenseRoute from "./src/router/license.route";
import partnerRoute from "./src/router/partner.route";
import testRoute from "./src/router/test.route";
import viriRoute from "./src/router/viri.route";
import authMiddleware from "./src/middleware/auth.middlleware";
import keyRoute from "./src/router/liscenseKey.route";
import secretMiddleware from "./src/middleware/secret.middleware";
import logger from "./src/configs/logger";
import licenseRouteInsecure from "./src/router/licenseunsecure.route";
import costRouteInsecure from "./src/router/costRouteInsecure.route";
import cors from "cors";
// config app
const dotenv = require("dotenv");
dotenv.config();

//
import appconfig from "./src/configs/configApp";
import databaseconfig from "./src/configs/database";
import { Errback, NextFunction, Response, Request } from "express";

databaseconfig.emit("connect");

// on connection start listener
databaseconfig.on("success", (connection: any) => {
  appconfig.emit("connect");
  appconfig.on("success", (app: any) => {
    app.use(cors());
    app.use(authMiddleware);
    app.use(secretMiddleware);
    app.use("/api/v2/user", userRoute);
    app.use("/api/v2/cost", costRoute);
    app.use("/api/v2/cost", costRouteInsecure);

    app.use("/api/v2/license", licenseRoute);
    app.use("/api/license", licenseRouteInsecure);

    app.use("/api/v2/partner", partnerRoute);
    app.use("/api/v2/virus", viriRoute);
    app.use("/test/v2/api", testRoute);
    app.use("/api/v2/key", keyRoute);
    app.use("/api", errorHandler);
    app.use("/api", (req: Request, res: Response) => {
      res.json({
        success: false,
        message: "Invalid Route",
      });
    });

    app.use("/test/api", (req: Request, res: Response) => {
      res.json({
        success: false,
        message: "Sorry Test for this route is not aviliable",
      });
    });
  });
});

databaseconfig.on("error", (err: Error) => {
  // when database cal gets fail
  console.log(err);
});

appconfig.on("err", (err: Error) => {
  // when server creation gets failcons\
  console.log(err);
});

function errorHandler(
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.emit("error", __dirname, "index.js", err.toString());
  if (process.env.ENVIRONMENT === "DEVLOPMENT") {
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
