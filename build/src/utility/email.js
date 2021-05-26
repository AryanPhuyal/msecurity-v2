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
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_1 = require("../utility/environment");
const mailer = new events_1.default();
const email = environment_1.EMAIL;
const password = environment_1.PASSWORD;
const emailProvider = environment_1.EMAIL_PROVIDER;
mailer.on("mail", (subject, body, emailTo) => __awaiter(void 0, void 0, void 0, function* () {
    var transporter = nodemailer_1.default.createTransport({
        port: 465,
        host: emailProvider,
        service: "SMTP",
        auth: {
            user: email,
            pass: password,
        },
    });
    // send mail
    var mailOptions = {
        from: "noreply@msecurity.app",
        to: emailTo,
        subject: subject,
        text: body,
    };
    try {
        const mail = yield transporter.sendMail(mailOptions);
        mailer.emit("success", mail);
    }
    catch (err) {
        mailer.emit("error", err);
    }
}));
exports.default = mailer;
