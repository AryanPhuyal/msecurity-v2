import { Request, Response, NextFunction } from "express";
import asyncHandeler from "express-async-handler";
import { getConnection, getRepository } from "typeorm";
import Partner from "../entity/Partner.entity";
import User from "../entity/User.entity";
import { jwtGet } from "../utility/jwtTools";

const isAuth = asyncHandeler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      jwtGet(bearerToken, async (err: any, data: any) => {
        if (err) {
          req.user = null;
          req.partner = null;
          return next();
        }
        if (!data) {
          return next();
        }
        if (data.partnerId) {
          const partner = await getConnection().manager.findOne(Partner, {
            where: {
              id: data["partnerId"],
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
            id: data["userId"],
          },
        });

        if (user) {
          req.user = user;
          return next();
        } else {
          req.user = null;
          return next();
        }
      });
    } else {
      req.user = null;
      req.partner = null;
      return next();
    }
  }
);

export default isAuth;
