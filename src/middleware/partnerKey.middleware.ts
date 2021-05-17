import { Response, Request, NextFunction } from "express";
import { getConnection } from "typeorm";
import LicenseKey from "../entity/liscenseKey.entity";

const partnerKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const connectionManager = getConnection().manager;
  if (!req.params["secret"]) {
    return res.status(401).json("unauthorized");
  }
  const key = await connectionManager.findOne(LicenseKey, {
    where: {
      key: req.params.secret,
    },
  });
  if (!key) {
    return res.status(401).json("unauthorized");
  }
  req.partner = key.partner;
  next();
};
export default partnerKeyMiddleware;
