import { body } from "express-validator";

const emailValidator = body("email")
  .notEmpty()
  .withMessage("Email should not be empty")
  .isEmail()
  .withMessage("Email Address is not valid");

const firstName = body("firstname")
  .notEmpty()
  .withMessage("firstname should not be empty");
const lastName = body("lastname")
  .notEmpty()
  .withMessage("Lastname should not be empty");

const password = body("password")
  .notEmpty()
  .withMessage("Password should not be empty")
  .isLength({ min: 4 })
  .withMessage("Password should be greater than 4 character");

const oldPassword = body("oldPassword")
  .notEmpty()
  .withMessage("Old Password should not be empty")
  .isLength({ min: 4 })
  .withMessage("Old Password should be greater than 4 character");

const newPassword = body("newPassword")
  .notEmpty()
  .withMessage("New Password should not be empty")
  .isLength({ min: 4 })
  .withMessage("New Password should be greater than 4 character");

const phone = body("phone")
  .notEmpty()
  .withMessage("Phone Number should be given");

export const createUserValidator = [
  emailValidator,
  firstName,
  lastName,
  password,
  phone,
];

export const loginValidator = [emailValidator, password];

export const changePasswordValidator = [oldPassword, newPassword];
