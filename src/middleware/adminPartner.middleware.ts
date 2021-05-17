import { Request, Response, NextFunction } from "express";
import asysnchandeler from "express-async-handler";

const isAdmin = asysnchandeler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.partner != null) {
      if (req.partner.role === "admin") {
        next();
      } else {
        res.statusCode = 403;
        throw "Unauthorize Response";
      }
    } else {
      res.statusCode = 403;
      throw "Unauthorize Response";
    }
  }
);

export default isAdmin;
``;
