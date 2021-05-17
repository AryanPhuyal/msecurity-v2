import { Request } from "express";
import multer, { Multer } from "multer";
import { rootDir } from "../utility/utils";
const csvFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, rootDir + "/uploads/csv");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-liscense-upload-${file.originalname}`);
  },
});

export default multer({ storage: storage, fileFilter: csvFilter });
