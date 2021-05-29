import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import Cost from "../entity/Cost.entity";
import { validationResult } from "express-validator";

// only admin can access all the function
export default class CostController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }

    const { platform, price, title } = req.body;
    const findPlatform = await getConnection().manager.findOne(Cost, {
      where: { platform: platform.toLowerCase() },
    });
    if (findPlatform) {
      res.statusCode = 400;
      throw "Platform already exists";
    }
    const newPlatform = new Cost();
    newPlatform.platform = platform.toLowerCase();
    newPlatform.price = price;
    newPlatform.title = title;
    await getConnection().manager.save(newPlatform);
    const addedPlatform = await getConnection().manager.findOne(Cost, {
      where: { platform: platform.toLowerCase() },
    });
    res.json({
      success: true,
      message: "Successfully added Platform",
      platform: addedPlatform,
    });
  });
  updatePrice = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { newPrice, title } = req.body;
    const { id } = req.params;
    const platform = await getConnection().manager.findOne(Cost, {
      where: { id },
    });
    if (!platform) {
      res.statusCode = 400;
      throw "Platform doesn't exists";
    }
    platform.price = newPrice;
    getConnection()
      .manager.createQueryBuilder(Cost, "cost")
      .update()
      .set({ price: newPrice, title: title })
      .where({ id: id })
      .execute();
    getConnection().manager.save(platform);
    res.json({
      success: true,
      message: "Successfully updated price",
    });
  });
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const platform = await getConnection().manager.findOne(Cost, {
      where: { id },
    });
    if (!platform) {
      res.statusCode = 400;
      throw "Platform doesn't exists";
    }
    await getConnection()
      .manager.createQueryBuilder()
      .update(Cost)
      .set({ delete: true })
      .where({ id: id })
      .execute();
    
    res.json({
      success: true,
      message: "Successfully deleted",
    });
  });

  list = asyncHandler(async (req: Request, res: Response) => {
    const cost = await getConnection().manager.find(Cost, { delete: false });
    return res.json({ success: true, platform: cost });
  });

  listOne = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cost = await getConnection().manager.find(Cost, {
      id: id,
      delete: false,
    });
    return res.json({ success: true, platform: cost });
  });

  // utility
  checkPlatformExists = async (platformId: string) => {
    const platform = await getConnection().manager.findOne(Cost, {
      where: { id: platformId },
    });
    if (platform) {
      return true;
    }
    return false;
  };
}
