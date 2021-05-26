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
const Viri_entity_1 = __importDefault(require("../entity/Viri.entity"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class ViriController {
    constructor() {
        this.addViri = (req, res) => { };
        this.removeViri = (req, res) => { };
        this.listViri = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const viri = yield typeorm_1.getConnection().manager.find(Viri_entity_1.default, { take: 10 });
            res.json({
                success: true,
                virus: viri,
            });
        }));
        this.testVirus = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { md5s } = req.body;
            const filter = md5s.map((e) => {
                return { code: e };
            });
            const viri = yield typeorm_1.getConnection().manager.find(Viri_entity_1.default, {
                where: filter,
                select: ["description", "name", "code"],
            });
            res.json(viri);
        }));
    }
}
exports.default = ViriController;
