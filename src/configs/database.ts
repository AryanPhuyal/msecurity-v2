import { createConnection } from "typeorm";
import Cost from "../entity/Cost.entity";
import { License } from "../entity/License.entity";
import Partner from "../entity/Partner.entity";
import Tranjection from "../entity/Tranjection.entity";
import User from "../entity/User.entity";
import Viri from "../entity/Viri.entity";

import EventEmitter from "events";
import LicenseKey from "../entity/liscenseKey.entity";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from "../utility/environment";
import logger from "./logger";

const databaseconfig = new EventEmitter();

databaseconfig.on("connect", async () => {
  await createConnection({
    type: "mysql",
    host: DATABASE_HOST,
    port: 3306,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    synchronize: false,
    entities: [User, License, Partner, Viri, Cost, Tranjection, LicenseKey],
  })
    .then((connection) => {
      logger.emit(
        "log",
        __dirname,
        "index.js",
        `successfully conected to database ${connection.options.database}`
      );
      databaseconfig.emit("success", connection);
    })
    .catch((err) => {
      databaseconfig.emit("error", err);
    });
});
export default databaseconfig;
