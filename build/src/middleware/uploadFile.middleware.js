"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utility/utils");
const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
        cb(null, true);
    }
    else {
        cb("Please upload only csv file.", false);
    }
};
var storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, utils_1.rootDir + "/uploads/csv");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-liscense-upload-${file.originalname}`);
    },
});
exports.default = multer_1.default({ storage: storage, fileFilter: csvFilter });
