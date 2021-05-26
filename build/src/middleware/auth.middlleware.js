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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const typeorm_1 = require("typeorm");
const Partner_entity_1 = __importDefault(require("../entity/Partner.entity"));
const User_entity_1 = __importDefault(require("../entity/User.entity"));
const jwtTools_1 = require("../utility/jwtTools");
const isAuth = express_async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwtTools_1.jwtGet(bearerToken, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                req.user = null;
                req.partner = null;
                return next();
            }
            if (!data) {
                return next();
            }
            if (data.partnerId) {
                const partner = yield typeorm_1.getConnection().manager.findOne(Partner_entity_1.default, {
                    where: {
                        id: data["partnerId"],
                    },
                });
                if (partner) {
                    req.partner = partner;
                    return next();
                }
                else {
                    req.partner = null;
                    return next();
                }
            }
            const user = yield typeorm_1.getConnection().manager.findOne(User_entity_1.default, {
                where: {
                    id: data["userId"],
                },
            });
            if (user) {
                req.user = user;
                return next();
            }
            else {
                req.user = null;
                return next();
            }
        }));
    }
    else {
        req.user = null;
        req.partner = null;
        return next();
    }
}));
exports.default = isAuth;
