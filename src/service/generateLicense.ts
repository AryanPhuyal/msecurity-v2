import { getConnection } from "typeorm";
import { License } from "../entity/License.entity";

// finad unique liscense
export const findUniqueLicense = async () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  while (true) {
    for (var i = 0; i < 12; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    const license = await getConnection().manager.findOne(License, {
      where: { license: text },
    });
    if (!license) {
      return text;
    }
    continue;
  }
};

// generate unique sn
export const findUniqueSn = async () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  while (true) {
    for (var i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    const license = await getConnection().manager.findOne(License, {
      where: { sn: text },
    });
    if (!license) {
      return text;
    }
    continue;
  }
};
