"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtGet = exports.jwtRetrive = exports.jwtSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const events_1 = __importDefault(require("events"));
const environment_1 = require("../utility/environment");
exports.jwtSign = new events_1.default();
exports.jwtRetrive = new events_1.default();
exports.jwtSign.on("generate", (data) => {
    const jwtSecret = environment_1.JWT_SECRET;
    jsonwebtoken_1.default.sign(data, jwtSecret, (err, token) => {
        if (err) {
            exports.jwtSign.emit("error", err);
        }
        else {
            exports.jwtSign.emit("success", token);
        }
    });
});
const jwtGet = (token, cb) => {
    const jwtSecret = environment_1.JWT_SECRET;
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, data) => {
        if (err) {
            cb(err, null);
        }
        else {
            cb(null, data);
            // jwtRetrive.emit("succ", data);
        }
    });
};
exports.jwtGet = jwtGet;
exports.jwtRetrive.on("retrive", (token) => {
    const jwtSecret = environment_1.JWT_SECRET;
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, data) => {
        if (err) {
            exports.jwtRetrive.emit("error", err);
        }
        else {
            exports.jwtRetrive.emit("success", err);
            // jwtRetrive.emit("succ", data);
        }
    });
});
