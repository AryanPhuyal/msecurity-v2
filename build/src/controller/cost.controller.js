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
const Cost_entity_1 = __importDefault(require("../entity/Cost.entity"));
const express_validator_1 = require("express-validator");
// only admin can access all the function
class CostController {
    constructor() {
        this.create = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { platform, price, title } = req.body;
            const findPlatform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { platform: platform.toLowerCase() },
            });
            if (findPlatform) {
                res.statusCode = 400;
                throw "Platform already exists";
            }
            const newPlatform = new Cost_entity_1.default();
            newPlatform.platform = platform.toLowerCase();
            newPlatform.price = price;
            newPlatform.title = title;
            yield typeorm_1.getConnection().manager.save(newPlatform);
            const addedPlatform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { platform: platform.toLowerCase() },
            });
            res.json({
                success: true,
                message: "Successfully added Platform",
                platform: addedPlatform,
            });
        }));
        this.updatePrice = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { newPrice, title } = req.body;
            const { id } = req.params;
            const platform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { id },
            });
            if (!platform) {
                res.statusCode = 400;
                throw "Platform doesn't exists";
            }
            platform.price = newPrice;
            typeorm_1.getConnection()
                .manager.createQueryBuilder(Cost_entity_1.default, "cost")
                .update()
                .set({ price: newPrice, title: title })
                .where({ id: id })
                .execute();
            typeorm_1.getConnection().manager.save(platform);
            res.json({
                success: true,
                message: "Successfully updated price",
            });
        }));
        this.delete = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const platform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { id },
            });
            if (!platform) {
                res.statusCode = 400;
                throw "Platform doesn't exists";
            }
            yield typeorm_1.getConnection()
                .manager.createQueryBuilder(Cost_entity_1.default, "cost")
                .update()
                .set({ delete: true })
                .where({ id: id })
                .execute();
            typeorm_1.getConnection().manager.save(platform);
            res.json({
                success: true,
                message: "Successfully updated price",
            });
        }));
        this.list = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const cost = yield typeorm_1.getConnection().manager.find(Cost_entity_1.default, { delete: false });
            return res.json({ success: true, platform: cost });
        }));
        this.listOne = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cost = yield typeorm_1.getConnection().manager.find(Cost_entity_1.default, {
                id: id,
                delete: false,
            });
            return res.json({ success: true, platform: cost });
        }));
        // utility
        this.checkPlatformExists = (platformId) => __awaiter(this, void 0, void 0, function* () {
            const platform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { id: platformId },
            });
            if (platform) {
                return true;
            }
            return false;
        });
    }
}
exports.default = CostController;
