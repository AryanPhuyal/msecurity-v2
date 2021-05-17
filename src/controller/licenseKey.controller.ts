import { Response, Request } from "express";
import { getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import LicenseKey from "../entity/liscenseKey.entity";
import Partner from "../entity/Partner.entity";
import expressAsyncHandeler from "express-async-handler";

export default class LiscenseKeyController {
  create = expressAsyncHandeler(async (req: Request, res: Response) => {
    const { partnerId } = req.body;
    const connectionManager = getConnection().manager;

    const partner = await connectionManager.findOne(Partner, {
      where: {
        id: partnerId,
      },
    });
    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exixts";
    }

    let uuid = uuidv4();
    const licenseKey = new LicenseKey();
    uuid += "pk_" + uuid;
    licenseKey.partner = partner!;

    licenseKey.key = uuid;
    await connectionManager.save(licenseKey);
    res.json({
      key: uuid,
    });
  });
  list = () => {
    const connectionManager = getConnection().manager;
  };
}
