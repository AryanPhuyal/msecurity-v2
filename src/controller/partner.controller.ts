import { Request, Response } from "express";
import { getConnection } from "typeorm";
import asyncHandler from "express-async-handler";
import Partner from "../entity/Partner.entity";
import passwordTool from "../utility/hashPassword";
import { jwtSign } from "../utility/jwtTools";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

export default class PartnerController {
  // only admin user can create partner
  //   password is mailed to end user via email
  //body
  // --name
  // --email
  // --location
  // --phone
  createPartner = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    var { name, email, location, phone, password, shopId } = req.body;
    if (!shopId) {
      shopId = uuidv4();
    }
    const partnerCount = await getConnection().manager.count(Partner);
    const newPartner = new Partner();
    if (partnerCount == 0) {
      newPartner.role = "admin";
    } else {
      const partnerExists = await getConnection()
        .manager.createQueryBuilder(Partner, "partner")
        .select("partner.id")
        .where("partner.email = :email OR partner.phone= :phone ", {
          email,
          phone,
        })
        .getCount();
      if (partnerExists >= 1) {
        res.statusCode = 409;
        throw "Partner with this email already exists";
      }
    }
    newPartner.name = name;
    newPartner.password = await passwordTool.hashPassword(password);
    newPartner.location = location;
    newPartner.email = email;
    newPartner.phone = phone;
    newPartner.shopId = shopId;
    const partner = await getConnection().manager.save(newPartner);

    res.json({
      success: true,
      message: "Successfully created partner",
      partner: partner,
    });
  });

  //   change password of partner via emailed link
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { oldPassword, newPassword } = req.body;
    const partner = req.partner;
    if (!partner) {
      res.statusCode = 401;
      throw "Unauthorize";
    }

    const getPartner = await getConnection().manager.findOne(Partner, {
      where: {
        id: partner.id,
      },
    });
    if (!getPartner) {
      res.statusCode = 400;
      throw "this user not found";
    }
    const comparePassword = await passwordTool.matchPassword(
      oldPassword,
      getPartner.password
    );
    if (!comparePassword) {
      res.statusCode = 400;
      throw "Password doesn't match. Try Again";
    }
    await getConnection()
      .manager.createQueryBuilder(Partner, "partner")
      .update()
      .set({ password: await passwordTool.hashPassword(newPassword) })
      .where({ id: getPartner.id })
      .execute();

    res.json({
      success: true,
      message: "Successfully updated password",
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { email, password } = req.body;
    const partner = await getConnection().manager.findOne(Partner, {
      where: { email },
    });
    if (!partner) {
      res.statusCode = 400;
      throw "User not exists";
    }
    const matchPassword = await passwordTool.matchPassword(
      password,
      partner.password
    );
    if (!matchPassword) {
      res.statusCode = 400;
      throw "User or Password is incorrect";
    }
    jwtSign.emit("generate", { partnerId: partner.id });
    jwtSign.on("success", (token: string) => {
      return res.json({
        success: true,
        token: token,
        user: {
          email: partner.email,
          location: partner.location,
          name: partner.name,
          id: partner.id,
          dueUpTO: partner.dueUpTo,
          role: partner.role,
          commission: partner.commission,
        },
      });
    });
    jwtSign.on("error", (err) => {
      throw err;
    });
  });

  // utility
  getLimit = async (id: string) => {
    const limit = await getConnection().manager.findOne(Partner, {
      select: ["dueUpTo"],
      where: { id },
    });
  };
  list = asyncHandler(async (req: Request, res: Response) => {
    const partners = await getConnection().manager.find(Partner);
    res.json({
      success: true,
      partners,
    });
  });
  //
}
