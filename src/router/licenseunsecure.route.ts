import { Router } from "express";
import LicenseController from "../controller/license.controller";
import partnerMiddleware from "../middleware/partner.middleware";
import uploadFile from "../middleware/uploadFile.middleware";
import adminPartnerMiddleware from "../middleware/adminPartner.middleware";
import {
  createLicenseValidator,
  licenseValidator,
} from "../validation/license.validator";

const router = Router();

const licenseController = new LicenseController();

router.post(
  "/create",
  partnerMiddleware,
  createLicenseValidator,
  licenseController.createLicense
);
router.get("/", licenseController.getAllLicense);
router.post("/activate", licenseValidator, licenseController.activateLicense);
router.post("/check", licenseController.checkdevice);
router.post("/buy", licenseController.requestLicense);
router.post("/buy/khalti", licenseController.khaltiPayment);
router.post("/buy/inapp", licenseController.inappPurchase);

router.post(
  "/upload-csv",
  partnerMiddleware,
  adminPartnerMiddleware,
  uploadFile.single("csv"),
  licenseController.importLiscenseFromCsv
);
export default router;
