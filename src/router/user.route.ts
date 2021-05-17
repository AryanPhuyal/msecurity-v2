import express, { Router } from "express";
import UserController from "../controller/user.controller";
import userMiddleware from "../middleware/user.middleware";
import {
  changePasswordValidator,
  loginValidator,
  createUserValidator,
} from "../validation/user.validator";

const router = Router();
const useController = new UserController();

router.post("/create", createUserValidator, useController.create);
router.post("/login", loginValidator, useController.login);
router.put(
  "/change-password",
  userMiddleware,
  changePasswordValidator,
  useController.changePassword
);
export default router;
