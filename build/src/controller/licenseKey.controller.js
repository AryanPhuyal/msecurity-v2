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
const uuid_1 = require("uuid");
const liscenseKey_entity_1 = __importDefault(require("../entity/liscenseKey.entity"));
const Partner_entity_1 = __importDefault(require("../entity/Partner.entity"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_entity_1 = __importDefault(require("../entity/User.entity"));
class LiscenseKeyController {
    constructor() {
        this.create = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { partnerId, userId, live } = req.body;
            const connectionManager = typeorm_1.getConnection().manager;
            let partner;
            let user;
            if (partnerId) {
                partner = yield connectionManager.findOne(Partner_entity_1.default, {
                    where: {
                        id: partnerId,
                    },
                });
                if (!partner) {
                    res.statusCode = 400;
                    throw "Partner not exixts";
                }
            }
            else if (userId) {
                user = yield connectionManager.findOne(User_entity_1.default, {
                    where: {
                        id: userId,
                    },
                });
                if (!user) {
                    throw "User not exists";
                }
            }
            else {
                throw "Partner or User required";
            }
            let uuid = live ? "lk_" + uuid_1.v4() : "tk_" + uuid_1.v4();
            const licenseKey = yield connectionManager
                .createQueryBuilder()
                .insert()
                .into(liscenseKey_entity_1.default)
                .values({
                key: uuid,
                partner: partner,
                user: user,
                live,
            })
                .execute();
            // const licenseKey = new LicenseKey();
            // // uuid += "pk_" + uuid;
            // licenseKey.partner = partner!;
            // licenseKey.live = live;
            // // licenseKey.user = null;
            // licenseKey.key = uuid;
            // await connectionManager.save(licenseKey);
            res.json({
                key: uuid,
                licenseKey,
            });
        }));
        // list = () => {
        //   const connectionManager = getConnection().manager;
        // };
    }
}
exports.default = LiscenseKeyController;
