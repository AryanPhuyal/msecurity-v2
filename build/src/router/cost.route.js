"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cost_controller_1 = __importDefault(require("../controller/cost.controller"));
const adminUser_middleware_1 = __importDefault(require("../middleware/adminUser.middleware"));
const cost_validation_1 = require("../validation/cost.validation");
const router = express_1.Router();
const costController = new cost_controller_1.default();
router.get("/", costController.list);
router.get("/:id", costController.listOne);
router.post("/create", adminUser_middleware_1.default, cost_validation_1.createValidation, costController.create);
router.put("/update-platform/:id", adminUser_middleware_1.default, costController.updatePrice);
router.delete("/delete-platform/:id", adminUser_middleware_1.default, costController.delete);
exports.default = router;
