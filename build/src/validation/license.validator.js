"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.licenseValidator = exports.createLicenseValidator = void 0;
const express_validator_1 = require("express-validator");
const numberValidator = express_validator_1.body("number")
    .notEmpty()
    .withMessage("Number must not be empty")
    .isNumeric()
    .withMessage("Number should be in number");
exports.createLicenseValidator = [numberValidator];
const license = express_validator_1.body("license")
    .notEmpty()
    .withMessage("License should not be empty")
    .isLength({ min: 12, max: 12 })
    .withMessage("License should be equals to 12 ");
const deviceId = express_validator_1.body("deviceId")
    .notEmpty()
    .withMessage("deviceId should not be empty");
const deviceType = express_validator_1.body("deviceType")
    .notEmpty()
    .withMessage("Device type should not be empty");
exports.licenseValidator = [license, deviceId, deviceType];
