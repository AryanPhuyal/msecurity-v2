import { body } from "express-validator";
const priceValidation = body("price")
  .notEmpty()
  .withMessage("Price should not be empty")
  .isNumeric()
  .withMessage("Price should be number");
const platformValidator = body("platform")
  .notEmpty()
  .withMessage("Platform Name should be given");

const titleValidator = body("title")
  .notEmpty()
  .withMessage("Title should not be empity")
  .isLength({ max: 100, min: 3 })
  .withMessage("Title should not be greater than 100 and less than 3");
export const createValidation = [
  priceValidation,
  platformValidator,
  titleValidator,
];
