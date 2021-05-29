import { Router } from "express";
import LicenseController from "../controller/license.controller";
import partnerMiddleware from "../middleware/partner.middleware";

const router = Router();

const licenseController = new LicenseController();

router.post(
  "/license/buy",
  partnerMiddleware,
  licenseController.requestLiscenseTest
);
export default router;
