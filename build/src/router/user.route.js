"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const user_middleware_1 = __importDefault(require("../middleware/user.middleware"));
const user_validator_1 = require("../validation/user.validator");
const router = express_1.Router();
const useController = new user_controller_1.default();
router.post("/create", user_validator_1.createUserValidator, useController.create);
router.post("/login", user_validator_1.loginValidator, useController.login);
router.put("/change-password", user_middleware_1.default, user_validator_1.changePasswordValidator, useController.changePassword);
exports.default = router;
