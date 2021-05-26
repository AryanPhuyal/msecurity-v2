"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const licenseKey_controller_1 = __importDefault(require("../controller/licenseKey.controller"));
const adminUser_middleware_1 = __importDefault(require("../middleware/adminUser.middleware"));
const router = express_1.Router();
const liscenseKeyController = new licenseKey_controller_1.default();
router.post("/", 
//  (req: Request, res: Response) => {
// });
adminUser_middleware_1.default, liscenseKeyController.create);
exports.default = router;
