"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const viri_controller_1 = __importDefault(require("../controller/viri.controller"));
const adminUser_middleware_1 = __importDefault(require("../middleware/adminUser.middleware"));
// import partnerKeyMiddleware from "../middleware/partnerKey.middleware";
const router = express_1.Router();
const viriController = new viri_controller_1.default();
router.get("/", viriController.listViri);
router.post("/test", adminUser_middleware_1.default, viriController.testVirus);
exports.default = router;
