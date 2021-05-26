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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Partner_entity_1 = __importDefault(require("../entity/Partner.entity"));
const hashPassword_1 = __importDefault(require("../utility/hashPassword"));
const jwtTools_1 = require("../utility/jwtTools");
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
class PartnerController {
    constructor() {
        // only admin user can create partner
        //   password is mailed to end user via email
        //body
        // --name
        // --email
        // --location
        // --phone
        this.createPartner = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            var { name, email, location, phone, password, shopId } = req.body;
            if (!shopId) {
                shopId = uuid_1.v4();
            }
            const partnerCount = yield typeorm_1.getConnection().manager.count(Partner_entity_1.default);
            const newPartner = new Partner_entity_1.default();
            if (partnerCount == 0) {
                newPartner.role = "admin";
            }
            else {
                const partnerExists = yield typeorm_1.getConnection()
                    .manager.createQueryBuilder(Partner_entity_1.default, "partner")
                    .select("partner.id")
                    .where("partner.email = :email OR partner.phone= :phone ", {
                    email,
                    phone,
                })
                    .getCount();
                if (partnerExists >= 1) {
                    res.statusCode = 409;
                    throw "Partner with this email already exists";
                }
            }
            newPartner.name = name;
            newPartner.password = yield hashPassword_1.default.hashPassword(password);
            newPartner.location = location;
            newPartner.email = email;
            newPartner.phone = phone;
            newPartner.shopId = shopId;
            const partner = yield typeorm_1.getConnection().manager.save(newPartner);
            res.json({
                success: true,
                message: "Successfully created partner",
                partner: partner,
            });
        }));
        //   change password of partner via emailed link
        this.changePassword = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { oldPassword, newPassword } = req.body;
            const partner = req.partner;
            if (!partner) {
                res.statusCode = 401;
                throw "Unauthorize";
            }
            const getPartner = yield typeorm_1.getConnection().manager.findOne(Partner_entity_1.default, {
                where: {
                    id: partner.id,
                },
            });
            if (!getPartner) {
                res.statusCode = 400;
                throw "this user not found";
            }
            const comparePassword = yield hashPassword_1.default.matchPassword(oldPassword, getPartner.password);
            if (!comparePassword) {
                res.statusCode = 400;
                throw "Password doesn't match. Try Again";
            }
            yield typeorm_1.getConnection()
                .manager.createQueryBuilder(Partner_entity_1.default, "partner")
                .update()
                .set({ password: yield hashPassword_1.default.hashPassword(newPassword) })
                .where({ id: getPartner.id })
                .execute();
            res.json({
                success: true,
                message: "Successfully updated password",
            });
        }));
        this.login = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { email, password } = req.body;
            const partner = yield typeorm_1.getConnection().manager.findOne(Partner_entity_1.default, {
                where: { email },
            });
            if (!partner) {
                res.statusCode = 400;
                throw "User not exists";
            }
            const matchPassword = yield hashPassword_1.default.matchPassword(password, partner.password);
            if (!matchPassword) {
                res.statusCode = 400;
                throw "User or Password is incorrect";
            }
            jwtTools_1.jwtSign.emit("generate", { partnerId: partner.id });
            jwtTools_1.jwtSign.on("success", (token) => {
                return res.json({
                    success: true,
                    token: token,
                    user: {
                        email: partner.email,
                        location: partner.location,
                        name: partner.name,
                        id: partner.id,
                        dueUpTO: partner.dueUpTo,
                        role: partner.role,
                        commission: partner.commission,
                    },
                });
            });
            jwtTools_1.jwtSign.on("error", (err) => {
                throw err;
            });
        }));
        // utility
        this.getLimit = (id) => __awaiter(this, void 0, void 0, function* () {
            const limit = yield typeorm_1.getConnection().manager.findOne(Partner_entity_1.default, {
                select: ["dueUpTo"],
                where: { id },
            });
        });
        this.list = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const partners = yield typeorm_1.getConnection().manager.find(Partner_entity_1.default);
            res.json({
                success: true,
                partners,
            });
        }));
        //
    }
}
exports.default = PartnerController;
