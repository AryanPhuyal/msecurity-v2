import express, { Router } from "express";
import ViriController from "../controller/viri.controller";
import partnerKeyMiddleware from "../middleware/partnerKey.middleware";

const router = Router();
const viriController = new ViriController();

router.get("/", viriController.listViri);
router.post("/test", partnerKeyMiddleware, viriController.testVirus);

export default router;
