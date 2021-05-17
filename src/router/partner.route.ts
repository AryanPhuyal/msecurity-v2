import express, { Router } from "express";
import PartnerController from "../controller/partner.controller";
import partnerMiddleware from "../midleware/partner.middleware";
import {
  changePasswordValidator,
  createPartnerValidator,
  loginValidator,
} from "../validation/partner.validator";

const router = Router();
const partnerController = new PartnerController();

router.post("/create", createPartnerValidator, partnerController.createPartner);
router.put(
  "/change-password",
  partnerMiddleware,
  changePasswordValidator,
  partnerController.changePassword
);
router.post("/login", loginValidator, partnerController.login);
router.get("/list", partnerController.list);

export default router;
