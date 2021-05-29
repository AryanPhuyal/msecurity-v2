import EventEmitter from "events";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD, EMAIL_PROVIDER } from "../utility/environment";

// const mailer = new EventEmitter();
const email = EMAIL;
const password = PASSWORD;
const emailProvider = EMAIL_PROVIDER;

const mailer = async (emailTo: string, subject: string, body: string) => {
  var transporter = nodemailer.createTransport({
    port: 465,
    host: emailProvider,
    service: "SMTP",
    auth: {
      user: email,
      pass: password,
    },
  });
  var mailOptions = {
    from: "noreply@msecurity.app",
    to: emailTo,
    subject: subject,
    text: body,
  };

  console.log(subject + " " + body);
  return await transporter.sendMail(mailOptions);
};

export default mailer;
