import express, { Router } from "express";
import CostController from "../controller/cost.controller";
import adminMiddleWare from "../middleware/adminUser.middleware";
import { createValidation } from "../validation/cost.validation";

const router = Router();

const costController = new CostController();

router.get("/", costController.list);
router.get("/:id", costController.listOne);

router.post(
  "/create",
  adminMiddleWare,
  createValidation,
  costController.create
);
router.put("/update-platform/:id", adminMiddleWare, costController.updatePrice);
router.delete("/delete-platform/:id", adminMiddleWare, costController.delete)
