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
const events_1 = __importDefault(require("events"));
const axios_1 = __importDefault(require("axios"));
const apis_1 = require("./apis");
const smsConfig = new events_1.default();
smsConfig.on("send", (to, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(apis_1.sms, {
            auth_token: process.env.SMS_KEY,
            to: to,
            text: text,
        });
        smsConfig.emit("success", response);
    }
    catch (err) {
        smsConfig.emit("error", err);
    }
}));
exports.default = smsConfig;
