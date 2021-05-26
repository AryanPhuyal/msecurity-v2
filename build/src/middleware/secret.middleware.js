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
const liscenseKey_entity_1 = __importDefault(require("../entity/liscenseKey.entity"));
var url = require("url");
const partnerKeyMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const connectionManager = typeorm_1.getConnection().manager;
    if (!req.query["secret"]) {
        return next();
    }
    const query = req.query.secret;
    if (query.includes("tk_")) {
        req.url = "/test" + req.url;
        // var pathname = url.parse(req.url).pathname;
        // // console.log(pathname);
        // pathname = "/test" + pathname;
    }
    const key = yield connectionManager.find(liscenseKey_entity_1.default, {
        where: {
            key: req.query.secret,
        },
    });
    if (key.length == 0) {
        return next();
    }
    if (key[0].partner) {
        req.partner = key[0].partner;
    }
    else {
        req.user = key[0].user;
    }
    next();
});
exports.default = partnerKeyMiddleware;
