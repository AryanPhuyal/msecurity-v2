import express, { Request, Response, Router } from "express";
import LiscenseKeyController from "../controller/licenseKey.controller";
import adminMiddleWare from "../middleware/adminUser.middleware";

const router = Router();

const liscenseKeyController = new LiscenseKeyController();

router.post(
  "/",
  //  (req: Request, res: Response) => {
  // });
  adminMiddleWare,
  liscenseKeyController.create
);
export default router;
