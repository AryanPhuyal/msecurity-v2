import { Response, Request, NextFunction } from "express";
import { getConnection } from "typeorm";
import LicenseKey from "../entity/liscenseKey.entity";
var url = require("url");

const partnerKeyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const connectionManager = getConnection().manager;
  if (!req.query["secret"]) {
    return next();
  }
  const query = req.query.secret as string;
  if (query.includes("tk_")) {
    req.url = "/test" + req.url;
    console.log(req.url);
    // var pathname = url.parse(req.url).pathname;
    // // console.log(pathname);
    // pathname = "/test" + pathname;
  }
  const key = await connectionManager.find(LicenseKey, {
    where: {
      key: req.query.secret,
    },
  });

  if (key.length == 0) {
    return next();
  }
  if (key[0].partner) {
    req.partner = key[0].partner;
  } else {
    req.user = key[0].user;
  }
  next();
};
export default partnerKeyMiddleware;
