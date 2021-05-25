import EventEmitter from "events";
import express from "express";
import { PORT } from "../utility/environment";
import logger from "./logger";
const serverConfig = new EventEmitter();

serverConfig.on("connect", () => {
  const app = express();
  app.use(express.json());
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
