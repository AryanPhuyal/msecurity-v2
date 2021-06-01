"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const license_controller_1 = __importDefault(require("../controller/license.controller"));
const partner_middleware_1 = __importDefault(require("../middleware/partner.middleware"));
const router = express_1.Router();
const licenseController = new license_controller_1.default();
router.post("/license/buy", partner_middleware_1.default, licenseController.requestLiscenseTest);
exports.default = router;
