"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apis_1 = require("./apis");
// const smsConfig = new EventEmitter();
const smsConfig = (to, text) => {
    // try {
    return axios_1.default.post(apis_1.sms, {
        auth_token: process.env.SMS_KEY,
        to: to,
        text: text,
    });
};
exports.default = smsConfig;
