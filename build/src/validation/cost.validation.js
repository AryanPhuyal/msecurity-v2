"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidation = void 0;
const express_validator_1 = require("express-validator");
const priceValidation = express_validator_1.body("price")
    .notEmpty()
    .withMessage("Price should not be empty")
    .isNumeric()
    .withMessage("Price should be number");
const platformValidator = express_validator_1.body("platform")
    .notEmpty()
    .withMessage("Platform Name should be given");
const titleValidator = express_validator_1.body("title")
    .notEmpty()
    .withMessage("Title should not be empity")
    .isLength({ max: 100, min: 3 })
    .withMessage("Title should not be greater than 100 and less than 3");
exports.createValidation = [
    priceValidation,
    platformValidator,
    titleValidator,
];
