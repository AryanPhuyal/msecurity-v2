"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.loginValidator = exports.createPartnerValidator = void 0;
const express_validator_1 = require("express-validator");
const emailValidator = express_validator_1.body("email")
    .notEmpty()
    .withMessage("Email should not be empty")
    .isEmail()
    .withMessage("Email Address is not valid");
const name = express_validator_1.body("name").notEmpty().withMessage("name should not be empty");
const location = express_validator_1.body("location")
    .notEmpty()
    .withMessage("Location should not be empty");
const password = express_validator_1.body("password")
    .notEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 4 })
    .withMessage("Password should be greater than 4 character");
const oldPassword = express_validator_1.body("oldPassword")
    .notEmpty()
    .withMessage("Old Password should not be empty")
    .isLength({ min: 4 })
    .withMessage("Old Password should be greater than 4 character");
const newPassword = express_validator_1.body("newPassword")
    .notEmpty()
    .withMessage("New Password should not be empty")
    .isLength({ min: 4 })
    .withMessage("New Password should be greater than 4 character");
const phone = express_validator_1.body("phone")
    .notEmpty()
    .withMessage("Phone Number should be given");
exports.createPartnerValidator = [
    emailValidator,
    name,
    location,
    password,
    phone,
];
exports.loginValidator = [emailValidator, password];
exports.changePasswordValidator = [oldPassword, newPassword];
