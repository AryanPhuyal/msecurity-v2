"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partner_controller_1 = __importDefault(require("../controller/partner.controller"));
const partner_middleware_1 = __importDefault(require("../middleware/partner.middleware"));
const partner_validator_1 = require("../validation/partner.validator");
const router = express_1.Router();
const partnerController = new partner_controller_1.default();
router.post("/create", partner_validator_1.createPartnerValidator, partnerController.createPartner);
router.put("/change-password", partner_middleware_1.default, partner_validator_1.changePasswordValidator, partnerController.changePassword);
router.post("/login", partner_validator_1.loginValidator, partnerController.login);
router.get("/list", partnerController.list);
exports.default = router;
