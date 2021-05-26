"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Cost_entity_1 = __importDefault(require("../entity/Cost.entity"));
const License_entity_1 = require("../entity/License.entity");
const Partner_entity_1 = __importDefault(require("../entity/Partner.entity"));
const Tranjection_entity_1 = __importDefault(require("../entity/Tranjection.entity"));
const User_entity_1 = __importDefault(require("../entity/User.entity"));
const Viri_entity_1 = __importDefault(require("../entity/Viri.entity"));
const events_1 = __importDefault(require("events"));
const liscenseKey_entity_1 = __importDefault(require("../entity/liscenseKey.entity"));
const environment_1 = require("../utility/environment");
const logger_1 = __importDefault(require("./logger"));
const databaseconfig = new events_1.default();
databaseconfig.on("connect", () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: "mysql",
        host: environment_1.DATABASE_HOST,
        port: 3306,
        username: environment_1.DATABASE_USER,
        password: environment_1.DATABASE_PASSWORD,
        database: environment_1.DATABASE_NAME,
        synchronize: true,
        entities: [User_entity_1.default, License_entity_1.License, Partner_entity_1.default, Viri_entity_1.default, Cost_entity_1.default, Tranjection_entity_1.default, liscenseKey_entity_1.default],
    })
        .then((connection) => {
        logger_1.default.emit("log", __dirname, "index.js", `successfully conected to database ${connection.options.database}`);
        databaseconfig.emit("success", connection);
    })
        .catch((err) => {
        databaseconfig.emit("error", err);
    });
}));
exports.default = databaseconfig;
