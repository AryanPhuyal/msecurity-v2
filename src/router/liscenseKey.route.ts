import express, { Router } from "express";
import LiscenseKeyController from "../controller/licenseKey.controller";
import adminMiddleWare from "../middleware/adminUser.middleware";

const router = Router();

const liscenseKeyController = new LiscenseKeyController();

router.get("/", adminMiddleWare, liscenseKeyController.create);
