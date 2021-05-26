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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUniqueSn = exports.findUniqueLicense = void 0;
const typeorm_1 = require("typeorm");
const License_entity_1 = require("../entity/License.entity");
// finad unique liscense
const findUniqueLicense = () => __awaiter(void 0, void 0, void 0, function* () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    while (true) {
        for (var i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        const license = yield typeorm_1.getConnection().manager.findOne(License_entity_1.License, {
            where: { license: text },
        });
        if (!license) {
            return text;
        }
        continue;
    }
});
exports.findUniqueLicense = findUniqueLicense;
// generate unique sn
const findUniqueSn = () => __awaiter(void 0, void 0, void 0, function* () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    while (true) {
        for (var i = 0; i < 15; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        const license = yield typeorm_1.getConnection().manager.findOne(License_entity_1.License, {
            where: { sn: text },
        });
        if (!license) {
            return text;
        }
        continue;
    }
});
exports.findUniqueSn = findUniqueSn;
