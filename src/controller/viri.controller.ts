import { getConnection } from "typeorm";
import Viri from "../entity/Viri.entity";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export default class ViriController {
  addViri = (req: Request, res: Response) => {};
  removeViri = (req: Request, res: Response) => {};
  listViri = asyncHandler(async (req: Request, res: Response) => {
    const viri = await getConnection().manager.find(Viri, { take: 10 });
    res.json({
      success: true,
      virus: viri,
    });
  });

  testVirus = asyncHandler(async (req: Request, res: Response) => {
    const { md5s } = req.body;
    const filter = md5s.map((e: string) => {
      return { code: e };
    });

    const viri = await getConnection().manager.find(Viri, {
      where: filter,
      select: ["description", "name", "code"],
    });
    res.json(viri);
  });
}
