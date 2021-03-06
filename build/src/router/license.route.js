"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const license_controller_1 = __importDefault(require("../controller/license.controller"));
const partner_middleware_1 = __importDefault(require("../middleware/partner.middleware"));
const uploadFile_middleware_1 = __importDefault(require("../middleware/uploadFile.middleware"));
const adminUser_middleware_1 = __importDefault(require("../middleware/adminUser.middleware"));
// import partnerMiddleware from "../middleware/partnerKey.middleware";
const adminPartner_middleware_1 = __importDefault(require("../middleware/adminPartner.middleware"));
const license_validator_1 = require("../validation/license.validator");
const router = express_1.Router();
const licenseController = new license_controller_1.default();
router.post("/create", adminUser_middleware_1.default, license_validator_1.createLicenseValidator, licenseController.createLicense);
router.get("/", licenseController.getAllLicense);
router.post("/activate", partner_middleware_1.default, license_validator_1.licenseValidator, licenseController.activateLicense);
router.post("/check", adminPartner_middleware_1.default, licenseController.checkdevice);
router.post("/buy", partner_middleware_1.default, licenseController.requestLicense);
router.post("/buy/khalti", partner_middleware_1.default, adminPartner_middleware_1.default, licenseController.khaltiPayment);
router.post("/buy/inapp", partner_middleware_1.default, licenseController.inappPurchase);
router.post("/upload-csv", partner_middleware_1.default, adminPartner_middleware_1.default, uploadFile_middleware_1.default.single("csv"), licenseController.importLiscenseFromCsv);
exports.default = router;
