import jwt, { Secret } from "jsonwebtoken";
import EventEmitter from "events";
import { JWT_SECRET } from "../utility/environment";
const jwtSign = new EventEmitter();
const jwtRetrive = new EventEmitter();

jwtSign.on("generate", (data) => {
  const jwtSecret = JWT_SECRET as Secret;
  jwt.sign(data, jwtSecret, (err: any, token: any) => {
    if (err) {
      jwtSign.emit("error", err);
    } else {
      jwtSign.emit("success", token);
    }
  });
});

jwtRetrive.on("retrive", (token: string) => {
  const jwtSecret = JWT_SECRET as Secret;
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      jwtRetrive.emit("error", err);
    } else {
      jwtRetrive.emit("success", data);
    }
  });
});

export default {
  jwtSign,
  jwtRetrive,
};
