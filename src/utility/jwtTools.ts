import jwt, { Secret } from "jsonwebtoken";
import EventEmitter from "events";
import { JWT_SECRET } from "../utility/environment";
export const jwtSign = new EventEmitter();
export const jwtRetrive = new EventEmitter();

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

export const jwtGet = (token: string, cb) => {
  const jwtSecret = JWT_SECRET as Secret;
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);

      // jwtRetrive.emit("succ", data);
    }
  });
};

jwtRetrive.on("retrive", (token: string) => {
  const jwtSecret = JWT_SECRET as Secret;
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      jwtRetrive.emit("error", err);
    } else {
      jwtRetrive.emit("success", err);

      // jwtRetrive.emit("succ", data);
    }
  });
});
