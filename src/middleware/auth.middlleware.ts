import { Request, Response, NextFunction } from "express";
import asyncHandeler from "express-async-handler";
import { getConnection, getRepository } from "typeorm";
import Partner from "../entity/Partner.entity";
import User from "../entity/User.entity";
import jwtTools from "../utility/jwtToken";
import dotenv from "../../utils/dotenv";

const isAuth = asyncHandeler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      jwtTools.decryptToken(
        bearerToken,
        dotenv.JWT_SECRET!,
        async (err: Error, authData: any) => {
          if (err) {
            return res.status(403).json({ error: "forbidden" });
          }

          if (authData.partnerId) {
            const partner = await getConnection().manager.findOne(Partner, {
              where: {
                id: authData["partnerId"],
              },
            });
            if (partner) {
              req.partner = partner;
              return next();
            } else {
              req.partner = null;
              return next();
            }
          }

          const user = await getConnection().manager.findOne(User, {
            where: {
              id: authData["userId"],
            },
          });
          if (user) {
            req.user = user;
            return next();
          } else {
            req.user = null;
            return next();
          }
        }
      );
    } else {
      req.user = null;
      req.partner = null;
      next();
    }
  }
);

export default isAuth;
