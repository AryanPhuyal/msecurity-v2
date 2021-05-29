import EventEmitter from "events";
import axios from "axios";
import { sms } from "./apis";

// const smsConfig = new EventEmitter();
const smsConfig = (to: any, text: string) => {
  // try {
  return axios.post(sms, {
    auth_token: process.env.SMS_KEY,
    to: to,
    text: text,
  });
};
export default smsConfig;
