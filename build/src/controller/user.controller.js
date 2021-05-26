"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashPassword_1 = __importDefault(require("../utility/hashPassword"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const typeorm_1 = require("typeorm");
const User_entity_1 = __importDefault(require("../entity/User.entity"));
const jwtTools_1 = require("../utility/jwtTools");
const express_validator_1 = require("express-validator");
class UserController {
    constructor() {
        // create user
        this.create = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { email, password, phone, firstname, lastname, middlename } = req.body;
            const userCount = yield typeorm_1.getConnection().manager.count(User_entity_1.default);
            const newUser = new User_entity_1.default();
            if (userCount == 0) {
                newUser.role = "admin";
            }
            else {
                const userExists = typeorm_1.getConnection().manager.findOne(User_entity_1.default, {
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
            newUser.password = yield hashPassword_1.default.hashPassword(password);
            typeorm_1.getConnection().manager.save(newUser);
            const user = yield typeorm_1.getConnection().manager.findOne(User_entity_1.default, {
                where: { email: email },
                select: ["email", "firstname", "lastname", "role", "id", "middlename"],
            });
            res.json({
                success: true,
                message: `Successfully created user for ${email}`,
                user,
            });
        }));
        // login User
        this.login = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { email, password } = req.body;
            const user = yield typeorm_1.getConnection().manager.findOne(User_entity_1.default, {
                where: { email },
            });
            if (user) {
                const correct = yield hashPassword_1.default.matchPassword(password, user.password);
                if (!correct) {
                    res.statusCode = 400;
                    throw "User or password is not correct";
                }
                jwtTools_1.jwtSign.emit("generate", { userId: user.id });
                jwtTools_1.jwtSign.on("error", (err) => {
                    throw err;
                });
                jwtTools_1.jwtSign.on("success", (token) => {
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
                });
            }
            else {
                res.statusCode = 400;
                throw "User with this email not found";
            }
        }));
        // change password
        this.changePassword = express_async_handler_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0]["msg"] });
            }
            const { newPassword, oldPassword } = req.body;
            const user = req.user;
            const currentUser = yield typeorm_1.getConnection().manager.findOne(User_entity_1.default, {
                where: { id: user.id },
            });
            if (!currentUser) {
                res.statusCode = 401;
                throw "Unauthorized";
            }
            const checkPassword = yield hashPassword_1.default.matchPassword(oldPassword, currentUser.password);
            if (!checkPassword) {
                res.statusCode = 400;
                throw "Password is incorrect";
            }
            const newHash = yield hashPassword_1.default.hashPassword(newPassword);
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
        }));
        // update User
    }
}
exports.default = UserController;
