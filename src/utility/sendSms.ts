import EventEmitter from "events";
import axios from "axios";
import { sms } from "./apis";

const smsConfig = new EventEmitter();

smsConfig.on("send", async (to: string, text: string) => {
  try {
    const response = await axios.post(sms, {
      auth_token: process.env.SMS_KEY,
      to: to,
      text: text,
    });
    smsConfig.emit("success", response);
  } catch (err) {
    smsConfig.emit("error", err);
  }
});
export default smsConfig;
