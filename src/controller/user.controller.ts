import { Request, Response } from "express";
import passwordTool from "../utility/hashPassword";
import asyncHandler from "express-async-handler";
import { getConnection } from "typeorm";
import User from "../entity/User.entity";
import { jwtGenerate, jwtSign } from "../utility/jwtTools";
import {} from "../utility/environment";
import { validationResult } from "express-validator";

export default class UserController {
  // create user
  create = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { email, password, phone, firstname, lastname, middlename } =
      req.body;

    const userCount = await getConnection().manager.count(User);
    const newUser = new User();
    if (userCount == 0) {
      newUser.role = "admin";
    } else {
      const userExists = getConnection().manager.findOne(User, {
        where: {
          email: email,
        },
      });
      if (userExists) {
        res.statusCode = 409;
        throw "User with this email already exists";
      }
    }
    newUser.email = email;
    newUser.phone = `${phone}`;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.middlename = middlename;
    newUser.password = await passwordTool.hashPassword(password);
    getConnection().manager.save(newUser);
    const user = await getConnection().manager.findOne(User, {
      where: { email: email },
      select: ["email", "firstname", "lastname", "role", "id", "middlename"],
    });
    res.json({
      success: true,
      message: `Successfully created user for ${email}`,
      user,
    });
  });

  // login User
  login = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { email, password } = req.body;
    const user = await getConnection().manager.findOne(User, {
      where: { email },
    });
    if (user) {
      const correct = await passwordTool.matchPassword(password, user.password);
      if (!correct) {
        res.statusCode = 400;
        throw "User or password is not correct";
      }
      jwtGenerate({ userId: user.id }, (err, token) => {
        if (!err) {
          return res.json({
            success: true,
            message: "Login Success",
            token: token,
            user: {
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              role: user.role,
            },
          });
        } else {
          throw err;
        }
      });
      // jwtSign.emit("generate", { userId: user.id });

      // jwtSign.on("error", (err) => {
      //   throw err;
      // });
      // jwtSign.on("success", (token) => {
      //   return res.json({
      //     success: true,
      //     message: "Login Success",
      //     token: token,
      //     user: {
      //       email: user.email,
      //       firstname: user.firstname,
      //       lastname: user.lastname,
      //       role: user.role,
      //     },
      //   });
      // });
    } else {
      res.statusCode = 400;
      throw "User with this email not found";
    }
  });

  // change password
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0]["msg"] });
    }
    const { newPassword, oldPassword } = req.body;
    const user = req.user!;

    const currentUser = await getConnection().manager.findOne(User, {
      where: { id: user.id },
    });
    if (!currentUser) {
      res.statusCode = 401;
      throw "Unauthorized";
    }
    const checkPassword = await passwordTool.matchPassword(
      oldPassword,
      currentUser.password
    );
    if (!checkPassword) {
      res.statusCode = 400;
      throw "Password is incorrect";
    }
    const newHash = await passwordTool.hashPassword(newPassword);

    // getConnection()
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({ password: newHash })
    //   .where({ id: user.id })
    //   .execute()
    //   .then(() => {
    //     res.json({
    //       success: true,
    //       message: "Successfully updated Password",
    //     });
    //   });
  });
  // update User
}
