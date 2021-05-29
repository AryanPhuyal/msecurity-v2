import { Router } from "express";
import LicenseController from "../controller/license.controller";
import partnerMiddleware from "../middleware/partner.middleware";
import uploadFile from "../middleware/uploadFile.middleware";
import adminUserMiddleware from "../middleware/adminUser.middleware";
// import partnerMiddleware from "../middleware/partnerKey.middleware";
import adminPartnerMiddleware from '../middleware/adminPartner.middleware';
import {
  createLicenseValidator,
  licenseValidator,
} from "../validation/license.validator";

const router = Router();

const licenseController = new LicenseController();

router.post(
  "/create",
  adminUserMiddleware,
  createLicenseValidator,
  licenseController.createLicense
);
 router.get("/", licenseController.getAllLicense);
router.post(
  "/activate",
  partnerMiddleware,
  licenseValidator,
  licenseController.activateLicense
);
router.post("/check", adminPartnerMiddleware, licenseController.checkdevice);
router.post("/buy", partnerMiddleware, licenseController.requestLicense);
router.post(
  "/buy/khalti",
  partnerMiddleware,
  adminPartnerMiddleware,
  licenseController.khaltiPayment
);
router.post("/buy/inapp", partnerMiddleware, licenseController.inappPurchase);

router.post(
  "/upload-csv",
  partnerMiddleware,
  adminPartnerMiddleware,
  uploadFile.single("csv"),
  licenseController.importLiscenseFromCsv
);
export default router;
