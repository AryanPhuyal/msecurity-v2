import { Router } from "express";
import LicenseController from "../controller/license.controller";

const router = Router();

const licenseController = new LicenseController();

router.post("/license/buy", licenseController.requestLiscenseTest);
export default router;
