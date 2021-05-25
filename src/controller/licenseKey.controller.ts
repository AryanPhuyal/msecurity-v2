import { Response, Request } from "express";
import { getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import LicenseKey from "../entity/liscenseKey.entity";
import Partner from "../entity/Partner.entity";
import expressAsyncHandeler from "express-async-handler";
import User from "../entity/User.entity";

export default class LiscenseKeyController {
  create = expressAsyncHandeler(async (req: Request, res: Response) => {
    const { partnerId, userId, live } = req.body;

    const connectionManager = getConnection().manager;
    let partner: Partner;
    let user: User;
    if (partnerId) {
      partner = await connectionManager.findOne(Partner, {
        where: {
          id: partnerId,
        },
      });
      if (!partner) {
        res.statusCode = 400;
        throw "Partner not exixts";
      }
    } else if (userId) {
      user = await connectionManager.findOne(User, {
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw "User not exists";
      }
    } else {
      throw "Partner or User required";
    }

    let uuid = live ? "lk_" + uuidv4() : "tk_" + uuidv4();

    const licenseKey = await connectionManager
      .createQueryBuilder()
      .insert()
      .into(LicenseKey)
      .values({
        key: uuid,
        partner: partner,
        user: user,
        live,
      })
      .execute();
    // const licenseKey = new LicenseKey();
    // // uuid += "pk_" + uuid;
    // licenseKey.partner = partner!;
    // licenseKey.live = live;
    // // licenseKey.user = null;

    // licenseKey.key = uuid;
    // await connectionManager.save(licenseKey);

    res.json({
      key: uuid,
      licenseKey,
    });
  });
  // list = () => {
  //   const connectionManager = getConnection().manager;
  // };
}
