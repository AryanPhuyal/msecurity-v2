"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const License_entity_1 = require("../entity/License.entity");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const typeorm_1 = require("typeorm");
const Cost_entity_1 = __importDefault(require("../entity/Cost.entity"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv = __importStar(require("fast-csv"));
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
const Partner_entity_1 = __importDefault(require("../entity/Partner.entity"));
const Tranjection_entity_1 = __importDefault(require("../entity/Tranjection.entity"));
const axios_1 = __importDefault(require("axios"));
const sendSms_1 = __importDefault(require("../utility/sendSms"));
const generateLicense_1 = require("../service/generateLicense");
const email_1 = __importDefault(require("../utility/email"));
const cost_controller_1 = __importDefault(require("./cost.controller"));
class LicenseController {
    constructor() {
        this.importLiscenseFromCsv = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const connectionManeger = typeorm_1.getConnection().manager;
            const { platform } = req.body;
            const pp = yield connectionManeger.findOne(Cost_entity_1.default, {
                where: {
                    platform: platform.toLowerCase(),
                },
            });
            if (!pp) {
                fs_1.default.unlinkSync(req.file.path);
                res.statusCode = 400;
                throw "Platform not exists";
            }
            if (req.file == undefined) {
                return res.status(400).send("Please upload a CSV file!");
            }
            let license = [];
            fs_1.default.createReadStream(path_1.default.resolve(req.file.path))
                .pipe(csv.parse({ headers: true }))
                .on("error", (error) => {
                throw error.message;
            })
                .on("data", (row) => {
                license.push(row);
            })
                .on("end", () => __awaiter(this, void 0, void 0, function* () {
                const filtered = license.map((x) => {
                    const newLicense = new License_entity_1.License();
                    newLicense.cost = pp;
                    newLicense.expires = x.expires ? x.expires : null;
                    newLicense.license = x.license;
                    newLicense.sn = x.sn;
                    newLicense.partner = req.partner;
                    newLicense.device = x.device;
                    return newLicense;
                });
                try {
                    const ll = yield connectionManeger
                        .createQueryBuilder()
                        .insert()
                        .into(License_entity_1.License)
                        .values(filtered)
                        .execute();
                }
                catch (err) {
                    res.status(400).json({
                        success: false,
                        error: err.message,
                    });
                }
                res.json(filtered);
            }));
        }));
        // activate license
        this.activateLicense = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { deviceId, deviceType, license } = req.body;
            const currentDate = Date.now();
            const expires = moment_1.default(currentDate).add({ year: 1 }).toDate();
            const currentDateInDate = moment_1.default(currentDate).toDate();
            const checkLicense = yield typeorm_1.getConnection().manager.find(License_entity_1.License, {
                where: {
                    device: deviceId,
                    expiresAt: typeorm_1.MoreThan(Date.now()),
                },
            });
            if (checkLicense.length > 0) {
                return res.json({
                    success: false,
                    error: "Liscense for this device already  exists",
                    expires: checkLicense[0].expiresAt,
                });
            }
            const platform = yield typeorm_1.getConnection().manager.findOne(Cost_entity_1.default, {
                where: { platform: deviceType.toLowerCase() },
            });
            if (!platform) {
                res.statusCode = 400;
                throw "Platform not exists";
            }
            const dLicense = yield typeorm_1.getConnection().manager.findOne(License_entity_1.License, {
                where: {
                    license,
                    cost: platform.id,
                },
            });
            if (!dLicense) {
                res.statusCode = 400;
                throw "License code doesn't exists";
            }
            if (dLicense.expiresAt == null) {
                yield typeorm_1.getConnection()
                    .manager.createQueryBuilder()
                    .update(License_entity_1.License)
                    .set({
                    expiresAt: expires,
                    device: deviceId,
                    timeOfActivation: currentDateInDate,
                    deviceType,
                })
                    .where("license=:id", { id: license })
                    .execute();
                return res.json({
                    success: true,
                    message: "Successfully activated license",
                });
            }
            else if (moment_1.default(Date.now()).isBefore(dLicense.expiresAt)) {
                yield typeorm_1.getConnection()
                    .manager.createQueryBuilder()
                    .update(License_entity_1.License)
                    .set({
                    expires: true,
                })
                    .execute();
                // res.json({
                //   success: true,
                //   message: "License already activated",
                // });
                res.statusCode = 400;
                throw "License already expires";
            }
            else if (dLicense.device == deviceId) {
                res.json({
                    success: true,
                    message: `License already activated on ${dLicense.timeOfActivation}`,
                    data: {
                        activatedAt: dLicense.timeOfActivation,
                        expiresAt: dLicense.expiresAt,
                    },
                });
            }
            else {
                return res.json("I dont know");
            }
        }));
        this.checkdevice = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { deviceID } = req.body;
            const license = yield typeorm_1.getConnection()
                .manager.createQueryBuilder()
                .from(License_entity_1.License, "license")
                .select(["max(expiresAt)  expiresAt,device"])
                .where("device=:device", { device: deviceID })
                .groupBy("device")
                .execute();
            const length = license.filter((e) => e.device != null).length;
            if (length == 0) {
                return res.json({
                    success: false,
                    error: "Not activated yet",
                });
            }
            else {
                if (moment_1.default(Date.now()).isAfter(license.expiresAt)) {
                    yield typeorm_1.getConnection()
                        .manager.createQueryBuilder()
                        .update(License_entity_1.License)
                        .set({
                        expires: true,
                    })
                        .execute();
                    return res.json({
                        success: false,
                        error: "expires",
                        expiresAt: license.expiresAt,
                    });
                }
                else {
                    return res.json({
                        success: true,
                        message: "Already activated",
                    });
                }
            }
        }));
        this.generateLiscense = () => { };
        this.requestLicense = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const connectionManager = typeorm_1.getConnection().manager;
            const { phoneno, email, price, type, refrence, shop_code } = req.body;
            if (((_a = req.partner) === null || _a === void 0 ? void 0 : _a.shopId) !== shop_code) {
                res.statusCode = 400;
                throw "Shop Code is not valid";
            }
            const partner = yield connectionManager.findOne(Partner_entity_1.default, {
                where: {
                    shopId: shop_code,
                },
            });
            if (!email && !phoneno) {
                res.statusCode = 400;
                throw "Email or phoneno required";
            }
            if (email &&
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                res.statusCode = 400;
                throw "Please enter correct email address";
            }
            if (phoneno && phoneno.toString().length != 10) {
                res.statusCode = 400;
                throw "Please enter correct phone no";
            }
            const platform = yield connectionManager.findOne(Cost_entity_1.default, {
                where: {
                    platform: type.toLowerCase(),
                },
            });
            // check shop_id exists or not
            if (!partner) {
                res.statusCode = 400;
                throw "Partner not exists";
            }
            // check platform exists
            if (!platform) {
                res.statusCode = 400;
                throw "Platform not exists";
            }
            const cost = platform.price;
            if (price < cost) {
                res.statusCode = 400;
                throw "price is insufficent";
            }
            return this.sendLiscense(email, partner, platform, phoneno, (license) => {
                res.status(200).json({
                    result: 1,
                    licenseCode: license,
                    validation: {
                        date: Date.now(),
                        timezone_type: 3,
                        timezone: "UTC",
                    },
                });
            });
        }));
        this.sendLiscense = (email, partner, platform, phoneno, cb) => __awaiter(this, void 0, void 0, function* () {
            let sn = yield generateLicense_1.findUniqueSn();
            let license = yield generateLicense_1.findUniqueLicense();
            const newLicense = new License_entity_1.License();
            newLicense.license = `${license}`;
            newLicense.sn = `${sn}`;
            newLicense.partner = partner;
            newLicense.cost = platform;
            const newTranjection = new Tranjection_entity_1.default();
            newTranjection.cost = platform.price;
            // newTranjection.licenses = new;
            newTranjection.partner = partner;
            const tt = yield typeorm_1.getConnection().manager.save(newTranjection); // var tt = await getConnection().manager.save(Tranjection);
            newLicense.tranjection = tt;
            yield typeorm_1.getConnection().manager.save(newLicense);
            if (phoneno) {
                while (true) {
                    sendSms_1.default.emit("send", phoneno, `Namaste,\nWelcome to MSecurity & Antivirus!\nYour License is: ${license}`);
                    sendSms_1.default.on("success", (data) => {
                        return cb(license);
                    });
                }
            }
            else if (email) {
                const message = `Namaste,\nWelcome to MSecurity & Antivirus!\nYour License is: ${license}`;
                const subject = "Msecurity activation";
                while (true) {
                    email_1.default.emit("mail", subject, message, email);
                    email_1.default.on("success", () => {
                        return cb(license);
                    });
                }
            }
        });
        this.khaltiPayment = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { phoneno, price, type, refrence, shop_code, token } = req.body;
            const response = yield axios_1.default.post("https://khalti.com/api/v2/payment/verify/", {
                token: token,
                amount: 50000,
            }, {
                headers: {
                    Authorization: "Key " + process.env.KHALTI_SECRET,
                },
            });
            if (response.status == 200) {
                const connectionManager = typeorm_1.getConnection().manager;
                const platform = yield connectionManager.findOne(Cost_entity_1.default, {
                    where: {
                        platform: type.toLowerCase(),
                    },
                });
                // check shop_id exists or not
                const partner = yield connectionManager.findOne(Partner_entity_1.default, {
                    where: {
                        shopId: shop_code,
                    },
                });
                if (!partner) {
                    res.statusCode = 400;
                    throw "Partner not exists";
                }
                // check platform exists
                if (!platform) {
                    res.statusCode = 400;
                    throw "Platform not exists";
                }
                const cost = platform.price;
                if (price < cost) {
                    res.statusCode = 400;
                    throw "price is insufficent";
                }
                this.sendLiscense(null, partner, platform, phoneno, (license) => {
                    res.status(200).json({
                        result: 1,
                        licenseCode: license,
                        validation: {
                            date: Date.now(),
                            timezone_type: 3,
                            timezone: "UTC",
                        },
                    });
                });
            }
        }));
        this.inappPurchase = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const connectionManager = typeorm_1.getConnection().manager;
            const { deviceId, platform, shopId } = req.body;
            if (!deviceId) {
                res.statusCode = 400;
                throw "Device Id is required";
            }
            if (!platform) {
                res.statusCode = 400;
                throw "Platform name is required";
            }
            const partner = yield connectionManager.findOne(Partner_entity_1.default, {
                where: {
                    shopId: shopId,
                },
            });
            if (!partner) {
                res.statusCode = 400;
                throw "Partner not exists";
            }
            const existPlatform = yield connectionManager.findOne(Cost_entity_1.default, {
                where: {
                    platform: "phone",
                },
            });
            if (!existPlatform) {
                res.statusCode = 400;
                throw "Platform not exists";
            }
            let sn = yield generateLicense_1.findUniqueSn();
            let license = yield generateLicense_1.findUniqueLicense();
            const newLicense = new License_entity_1.License();
            newLicense.device = deviceId;
            newLicense.timeOfActivation = moment_1.default(Date.now()).add({ year: 1 }).toDate();
            newLicense.license = `${license}`;
            newLicense.sn = `${sn}`;
            newLicense.partner = partner;
            newLicense.cost = existPlatform;
            const newTranjection = new Tranjection_entity_1.default();
            newTranjection.cost = 500;
            // newTranjection.licenses = new;
            newTranjection.partner = partner;
            const tt = yield typeorm_1.getConnection().manager.save(newTranjection); // var tt = await getConnection().manager.save(Tranjection);
            newLicense.tranjection = tt;
            yield typeorm_1.getConnection().manager.save(newLicense);
            res.json({ success: true });
        }));
        this.requestLiscenseTest = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const connectionManager = typeorm_1.getConnection().manager;
            const { phoneno, email, price, type, refrence, shop_code } = req.body;
            const partner = yield connectionManager.findOne(Partner_entity_1.default, {
                where: {
                    shopId: shop_code,
                },
            });
            if (partner.id != req.partner.id) {
                res.statusCode = 403;
                throw "Unauthorized";
            }
            if (!email && !phoneno) {
                res.statusCode = 400;
                throw "Email or phoneno required";
            }
            if (email &&
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                res.statusCode = 400;
                throw "Please enter correct email address";
            }
            if (phoneno && phoneno.toString().length != 10) {
                res.statusCode = 400;
                throw "Please enter correct phone no";
            }
            const platform = yield connectionManager.findOne(Cost_entity_1.default, {
                where: {
                    platform: type.toLowerCase(),
                },
            });
            // check shop_id exists or not
            if (!partner) {
                res.statusCode = 400;
                throw "Partner not exists";
            }
            // check platform exists
            if (!platform) {
                res.statusCode = 400;
                throw "Platform not exists";
            }
            const cost = platform.price;
            if (price < cost) {
                res.statusCode = 400;
                throw "price is insufficent";
            }
            let license = yield generateLicense_1.findUniqueLicense();
            res.status(200).json({
                result: 1,
                licenseCode: license,
                validation: {
                    date: Date.now(),
                    timezone_type: 3,
                    timezone: "UTC",
                },
            });
        }));
        this.createLicense = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { number, platformId } = req.body;
            // check platform exists
            const costController = new cost_controller_1.default();
            const exists = yield costController.checkPlatformExists(platformId);
            if (!exists) {
                res.statusCode = 400;
                throw "Platform not exists";
            }
            for (var i = 0; i < number; i++) {
                let sn = yield generateLicense_1.findUniqueSn();
                let license = yield generateLicense_1.findUniqueLicense();
                const newLicense = new License_entity_1.License();
                newLicense.license = `${license}`;
                newLicense.sn = `${sn}`;
                newLicense.partner = req.partner;
                newLicense.cost = platformId;
                yield typeorm_1.getConnection().manager.save(newLicense);
            }
            res.json({
                success: true,
                message: `Successfully created ${number} Licenses`,
            });
        }));
    }
}
exports.default = LicenseController;
``;
