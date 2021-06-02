import EventEmitter from "events";
import express, { NextFunction, Request, Response } from "express";
import { ENVIRONMENT, PORT } from "../utility/environment";
import logger from "./logger";
const serverConfig = new EventEmitter();
import path from "path";
import fs from "fs";

serverConfig.on("connect", () => {
  const app = express();
  if (
    fs.existsSync(
      ENVIRONMENT === "DEVELOPMENT"
        ? path.join(__dirname, "public", "build")
        : path.join(__dirname, "../", "public", "build")
    )
  ) {
    app.use(
      express.static(
        ENVIRONMENT === "DEVELOPMENT"
          ? path.join(__dirname, "public", "build")
          : path.join(__dirname, "../", "public", "build")
      )
    );
  }
  // app.use((req:Request,res:Response,next:NextFunction)=>{
  //   console.log(req);
  // })

  app.use(express.json({}));
  // console.log("asas");
  app.listen(PORT, () => {
    logger.emit(
      "log",
      __dirname,
      "index.js",
      `Server is running at Port ${PORT}`
    );
    serverConfig.emit("success", app);
  });
});

export default serverConfig;
