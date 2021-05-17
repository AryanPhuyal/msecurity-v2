import { body } from "express-validator";
const numberValidator = body("number")
  .notEmpty()
  .withMessage("Number must not be empty")
  .isNumeric()
  .withMessage("Number should be in number");

export const createLicenseValidator = [numberValidator];

const license = body("license")
  .notEmpty()
  .withMessage("License should not be empty")
  .isLength({ min: 12, max: 12 })
  .withMessage("License should be equals to 12 ");

const deviceId = body("deviceId")
  .notEmpty()
  .withMessage("deviceId should not be empty");

const deviceType = body("deviceType")
  .notEmpty()
  .withMessage("Device type should not be empty");

export const licenseValidator = [license, deviceId, deviceType];
