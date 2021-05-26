"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const License_entity_1 = require("./License.entity");
const liscenseKey_entity_1 = __importDefault(require("./liscenseKey.entity"));
const Tranjection_entity_1 = __importDefault(require("./Tranjection.entity"));
let Partner = class Partner {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Partner.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "normal" }),
    __metadata("design:type", String)
], Partner.prototype, "role", void 0);
__decorate([
    typeorm_1.Column({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Partner.prototype, "dueUpTo", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Partner.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Partner.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Partner.prototype, "location", void 0);
__decorate([
    typeorm_1.Column({ type: Number, default: 50 }),
    __metadata("design:type", Number)
], Partner.prototype, "commission", void 0);
__decorate([
    typeorm_1.Column({ type: String, nullable: false, unique: true }),
    __metadata("design:type", String)
], Partner.prototype, "shopId", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Partner.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Partner.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => License_entity_1.License, (license) => license.partner),
    __metadata("design:type", Array)
], Partner.prototype, "licenses", void 0);
__decorate([
    typeorm_1.OneToMany(() => Tranjection_entity_1.default, (tranjection) => tranjection.partner),
    __metadata("design:type", Array)
], Partner.prototype, "tranjections", void 0);
__decorate([
    typeorm_1.OneToMany(() => liscenseKey_entity_1.default, (licenseKey) => licenseKey.partner),
    __metadata("design:type", liscenseKey_entity_1.default)
], Partner.prototype, "liscenseKey", void 0);
Partner = __decorate([
    typeorm_1.Entity("partner")
], Partner);
exports.default = Partner;
