import EventEmitter from "events";
import nodemailer from "nodemailer";
import { EMAIL, PASSWORD, EMAIL_PROVIDER } from "../utility/environment";

const mailer = new EventEmitter();
const email = EMAIL;
const password = PASSWORD;
const emailProvider = EMAIL_PROVIDER;

mailer.on("mail", async (subject: string, body: string, emailTo: string) => {
  var transporter = nodemailer.createTransport({
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
    const mail = await transporter.sendMail(mailOptions);
    mailer.emit("success", mail);
  } catch (err) {
    mailer.emit("error", err);
  }
});

export default mailer;
