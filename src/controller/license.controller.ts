import { License } from "../entity/License.entity";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { getConnection, MoreThan, createQueryBuilder } from "typeorm";
import Cost from "../entity/Cost.entity";
import fs from "fs";
import path from "path";
import * as csv from "fast-csv";
import { body, validationResult } from "express-validator";
import moment from "moment";
import Partner from "../entity/Partner.entity";
import Tranjection from "../entity/Tranjection.entity";
import axios from "axios";
import sms from "../utility/sendSms";
import { findUniqueLicense, findUniqueSn } from "../service/generateLicense";
import mailer from "../utility/email";
import CostController from "./cost.controller";
import smsConfig from "../utility/sendSms";

export default class LicenseController {
  getAllLicense = asyncHandler(async (req: Request, res: Response) => {
    const license = await createQueryBuilder("license", "license")
      .leftJoinAndSelect("cost", "cost", "license.costId = cost.id")
      .leftJoinAndSelect("partner", "partner", "partner.id = license.partnerId")
      .execute();
    return res.json({
      success: true,
      data: license,
    });
  });

  importLiscenseFromCsv = asyncHandler(async (req: Request, res: Response) => {
    const connectionManeger = getConnection().manager;
    const { platform } = req.body;

    const pp = await connectionManeger.findOne(Cost, {
      where: {
        platform: platform.toLowerCase(),
      },
    });
    if (!pp) {
      fs.unlinkSync(req.file.path);
      res.statusCode = 400;
      throw "Platform not exists";
    }
    if (req.file == undefined) {
      return res.status(400).send("Please upload a CSV file!");
    }
    let license: any[] = [];
    fs.createReadStream(path.resolve(req.file.path))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error: any) => {
        throw error.message;
      })
      .on("data", (row) => {
        license.push(row);
      })
      .on("end", async () => {
        const filtered = license.map((x) => {
          const newLicense = new License();
          newLicense.cost = pp;
          newLicense.expires = x.expires ? x.expires : null;
          newLicense.license = x.license;
          newLicense.sn = x.sn;
          newLicense.partner = req.partner!;
          newLicense.device = x.device;
          return newLicense;
        });
        try {
          const ll = await connectionManeger
            .createQueryBuilder()
            .insert()
            .into(License)
            .values(filtered)
            .execute();
        } catch (err) {
          res.status(400).json({
            success: false,
            error: err.message,
          });
        }

        res.json(filtered);
      });
  });

  // activate license
  activateLicense = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { deviceId, deviceType, license } = req.body;
    const currentDate = Date.now();
    const expires = moment(currentDate).add({ year: 1 }).toDate();
    const currentDateInDate = moment(currentDate).toDate();

    const checkLicense = await getConnection().manager.find(License, {
      where: {
        device: deviceId,
        expiresAt: MoreThan(Date.now()),
      },
    });
    if (checkLicense.length > 0) {
      return res.json({
        success: false,
        error: "Liscense for this device already  exists",
        expires: checkLicense[0].expiresAt,
      });
    }

    const platform = await getConnection().manager.findOne(Cost, {
      where: { platform: deviceType.toLowerCase() },
    });
    if (!platform) {
      res.statusCode = 400;
      throw "Platform not exists";
    }
    const dLicense = await getConnection().manager.findOne(License, {
      where: {
        license,
        cost: platform.id,
      },
    });
    if (!dLicense) {
      res.statusCode = 400;
      throw "License code doesn't exists";
    }
    if (dLicense.expiresAt == null) {
      await getConnection()
        .manager.createQueryBuilder()
        .update(License)
        .set({
          expiresAt: expires,
          device: deviceId,
          timeOfActivation: currentDateInDate,
          deviceType,
        })
        .where("license=:id", { id: license })
        .execute();
      return res.json({
        success: true,
        message: "Successfully activated license",
      });
    } else if (moment(Date.now()).isBefore(dLicense.expiresAt)) {
      await getConnection()
        .manager.createQueryBuilder()
        .update(License)
        .set({
          expires: true,
        })
        .execute();
      // res.json({
      //   success: true,
      //   message: "License already activated",
      // });

      res.statusCode = 400;
      throw "License already expires";
    } else if (dLicense.device == deviceId) {
      res.json({
        success: true,
        message: `License already activated on ${dLicense.timeOfActivation}`,
        data: {
          activatedAt: dLicense.timeOfActivation,
          expiresAt: dLicense.expiresAt,
        },
      });
    } else {
      return res.json("I dont know");
    }
  });

  checkdevice = asyncHandler(async (req: Request, res: Response) => {
    const { deviceID } = req.body;
    const license = await getConnection()
      .manager.createQueryBuilder()
      .from(License, "license")

      .select(["max(expiresAt)  expiresAt,device"])
      .where("device=:device", { device: deviceID })
      .groupBy("device")
      .execute();
    const length = license.filter(
      (e: { device: any }) => e.device != null
    ).length;
    if (length == 0) {
      return res.json({
        success: false,
        error: "Not activated yet",
      });
    } else {
      if (moment(Date.now()).isAfter(license.expiresAt)) {
        await getConnection()
          .manager.createQueryBuilder()
          .update(License)
          .set({
            expires: true,
          })
          .execute();
        return res.json({
          success: false,
          error: "expires",
          expiresAt: license.expiresAt,
        });
      } else {
        return res.json({
          success: true,
          message: "Already activated",
        });
      }
    }
  });

  generateLiscense = () => {};

  requestLicense = asyncHandler(async (req: Request, res: Response) => {
    const connectionManager = getConnection().manager;

    const { phoneno, email, price, type, reference, shop_code } = req.body;
    if (req.partner?.shopId !== shop_code) {
      res.statusCode = 400;
      throw "Shop Code is not valid";
    }
    const partner = await connectionManager.findOne(Partner, {
      where: {
        shopId: shop_code,
      },
    });

    if (!email && !phoneno) {
      res.statusCode = 400;
      throw "Email or phoneno required";
    }
    if (
      email &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      res.statusCode = 400;
      throw "Please enter correct email address";
    }
    if (phoneno && phoneno.toString().length != 10) {
      res.statusCode = 400;
      throw "Please enter correct phone no";
    }

    const platform = await connectionManager.findOne(Cost, {
      where: {
        platform: type.toLowerCase(),
      },
    });
    // check shop_id exists or not

    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exists";
    }
    // check platform exists
    if (!platform) {
      res.statusCode = 400;
      throw "Platform not exists";
    }
    const cost = platform.price;
    if (price === cost) {
      res.statusCode = 400;
      throw "price is insufficent";
    }

    return this.sendLiscense(
      reference,
      email,
      partner,
      platform,
      phoneno,
      (err: any, license: String) => {
        if (err) {
          res.statusCode = 400;
          throw err;
        }
        res.status(200).json({
          result: 1,
          licenseCode: license,
          validation: {
            date: Date.now(),
            timezone_type: 3,
            timezone: "UTC",
          },
        });
      }
    );
  });

  requestLicenseInsecure = asyncHandler(async (req: Request, res: Response) => {
    const connectionManager = getConnection().manager;

    const { phoneno, email, price, type, reference, shop_code } = req.body;

    const partner = await connectionManager.findOne(Partner, {
      where: {
        shopId: shop_code,
      },
    });

    if (!email && !phoneno) {
      res.statusCode = 400;
      throw "Email or phoneno required";
    }
    if (
      email &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      res.statusCode = 400;
      throw "Please enter correct email address";
    }
    if (phoneno && phoneno.toString().length != 10) {
      res.statusCode = 400;
      throw "Please enter correct phone no";
    }

    const platform = await connectionManager.findOne(Cost, {
      where: {
        platform: type.toLowerCase(),
      },
    });
    // check shop_id exists or not

    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exists";
    }
    // check platform exists
    if (!platform) {
      res.statusCode = 400;
      throw "Platform not exists";
    }
    const cost = platform.price;
    if (price !== cost) {
      res.statusCode = 400;
      throw "price is insufficent";
    }

    return this.sendLiscense(
      reference,
      email,
      partner,
      platform,
      phoneno,
      (err: any, license: String) => {
        if (err) {
          res.statusCode = 400;
          throw err;
        }
        res.status(200).json({
          result: 1,
          licenseCode: license,
          validation: {
            date: Date.now(),
            timezone_type: 3,
            timezone: "UTC",
          },
        });
      }
    );
  });

  sendLiscense = async (
    reference: string | null,
    email: string | null,
    partner: Partner,
    platform: Cost,
    phoneno: String,
    cb: Function
  ) => {
    let sn: string = await findUniqueSn();
    let license: string = await findUniqueLicense();

    const newLicense = new License();
    newLicense.license = `${license}`;
    newLicense.sn = `${sn}`;
    newLicense.partner = partner;
    newLicense.cost = platform;
    const newTranjection = new Tranjection();
    newTranjection.cost = platform.price;
    if (reference) {
      const testTranjection = await getConnection().manager.findOne(
        Tranjection,
        { where: { id: reference } }
      );
      if (testTranjection) {
        cb("tranjection id already exists");
      }
      newTranjection.id = reference;
    }
    // newTranjection.licenses = new;
    newTranjection.partner = partner;
    const tt = await getConnection().manager.save(newTranjection); // var tt = await getConnection().manager.save(Tranjection);
    newLicense.tranjection = tt;
    await getConnection().manager.save(newLicense);
    if (phoneno) {
      while (true) {
        try {
          await smsConfig(
            phoneno,
            `Namaste,\nWelcome to MSecurity & Antivirus!\nPlease use this for ${platform.title}\nYour License is: ${license}`
          );
          return cb(null, license);
        } catch (err) {}
      }
    } else if (email) {
      const message = `Namaste,\nWelcome to MSecurity & Antivirus!\nPlease use this for ${platform.title}\nYour License is: ${license}`;

      const subject = "Msecurity activation";
      while (true) {
        try {
          await mailer(email, subject, message);
          return cb(null, license);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  khaltiPayment = asyncHandler(async (req: Request, res: Response) => {
    const { phoneno, price, type, reference, shop_code, token } = req.body;
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token: token,
        amount: 50000,
      },
      {
        headers: {
          Authorization: "Key " + process.env.KHALTI_SECRET,
        },
      }
    );

    if (response.status == 200) {
      const connectionManager = getConnection().manager;

      const platform = await connectionManager.findOne(Cost, {
        where: {
          platform: type.toLowerCase(),
        },
      });
      // check shop_id exists or not
      const partner = await connectionManager.findOne(Partner, {
        where: {
          shopId: shop_code,
        },
      });
      if (!partner) {
        res.statusCode = 400;
        throw "Partner not exists";
      }
      // check platform exists
      if (!platform) {
        res.statusCode = 400;
        throw "Platform not exists";
      }
      const cost = platform.price;
      if (price !== cost) {
        res.statusCode = 400;
        throw "price is insufficent";
      }
      this.sendLiscense(
        null,
        null,
        partner,
        platform,
        phoneno,
        (err: any, license: String) => {
          if (err) {
            res.statusCode = 400;
            throw err;
          }
          res.status(200).json({
            result: 1,
            licenseCode: license,
            validation: {
              date: Date.now(),
              timezone_type: 3,
              timezone: "UTC",
            },
          });
        }
      );
    }
  });

  inappPurchase = asyncHandler(async (req: Request, res: Response) => {
    const connectionManager = getConnection().manager;
    const { deviceId, platform, shopId } = req.body;
    if (!deviceId) {
      res.statusCode = 400;
      throw "Device Id is required";
    }
    if (!platform) {
      res.statusCode = 400;
      throw "Platform name is required";
    }

    const partner = await connectionManager.findOne(Partner, {
      where: {
        shopId: shopId,
      },
    });
    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exists";
    }
    const existPlatform = await connectionManager.findOne(Cost, {
      where: {
        platform: "phone",
      },
    });
    if (!existPlatform) {
      res.statusCode = 400;
      throw "Platform not exists";
    }
    let sn: string = await findUniqueSn();
    let license: string = await findUniqueLicense();

    const newLicense = new License();
    newLicense.device = deviceId;
    newLicense.timeOfActivation = moment(Date.now()).add({ year: 1 }).toDate();
    newLicense.license = `${license}`;
    newLicense.sn = `${sn}`;
    newLicense.partner = partner;
    newLicense.cost = existPlatform;
    const newTranjection = new Tranjection();
    newTranjection.cost = 500;

    // newTranjection.licenses = new;
    newTranjection.partner = partner;
    const tt = await getConnection().manager.save(newTranjection); // var tt = await getConnection().manager.save(Tranjection);
    newLicense.tranjection = tt;
    await getConnection().manager.save(newLicense);
    res.json({ success: true });
  });

  requestLiscenseTest = asyncHandler(async (req: Request, res: Response) => {
    const connectionManager = getConnection().manager;
    const { phoneno, email, price, type, reference, shop_code } = req.body;
    const partner = await connectionManager.findOne(Partner, {
      where: {
        shopId: shop_code,
      },
    });
    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exists";
    }
    if (partner.id != req.partner.id) {
      res.statusCode = 403;
      throw "Unauthorized";
    }
    if (!email && !phoneno) {
      res.statusCode = 400;
      throw "Email or phoneno required";
    }
    if (
      email &&
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      res.statusCode = 400;
      throw "Please enter correct email address";
    }
    if (phoneno && phoneno.toString().length != 10) {
      res.statusCode = 400;
      throw "Please enter correct phone no";
    }

    const platform = await connectionManager.findOne(Cost, {
      where: {
        platform: type.toLowerCase(),
      },
    });
    // check shop_id exists or not

    if (!partner) {
      res.statusCode = 400;
      throw "Partner not exists";
    }
    // check platform exists
    if (!platform) {
      res.statusCode = 400;
      throw "Platform not exists";
    }
    const cost = platform.price;
    if (price !== cost) {
      res.statusCode = 400;
      throw "price is insufficent";
    }
    let license: string = await findUniqueLicense();

    res.status(200).json({
      result: 1,
      licenseCode: license,
      validation: {
        date: Date.now(),
        timezone_type: 3,
        timezone: "UTC",
      },
    });
  });

  createLicense = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { number, platformId } = req.body;

    // check platform exists
    const costController = new CostController();
    const exists = await costController.checkPlatformExists(platformId);
    if (!exists) {
      res.statusCode = 400;
      throw "Platform not exists";
    }

    for (var i = 0; i < number; i++) {
      let sn: string = await findUniqueSn();
      let license: string = await findUniqueLicense();
      const newLicense = new License();
      newLicense.license = `${license}`;
      newLicense.sn = `${sn}`;
      newLicense.partner = req.partner!;
      newLicense.cost = platformId;
      await getConnection().manager.save(newLicense);
    }
    res.json({
      success: true,
      message: `Successfully created ${number} Licenses`,
    });
  });
}
``;
