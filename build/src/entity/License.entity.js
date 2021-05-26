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
exports.License = void 0;
const typeorm_1 = require("typeorm");
const Cost_entity_1 = __importDefault(require("./Cost.entity"));
const Partner_entity_1 = __importDefault(require("./Partner.entity"));
const Tranjection_entity_1 = __importDefault(require("./Tranjection.entity"));
const User_entity_1 = __importDefault(require("./User.entity"));
let License = class License {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], License.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], License.prototype, "sn", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], License.prototype, "expiresAt", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], License.prototype, "license", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], License.prototype, "device", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], License.prototype, "deviceType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], License.prototype, "timeOfActivation", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], License.prototype, "expires", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], License.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], License.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_entity_1.default, (user) => user.licenses),
    __metadata("design:type", User_entity_1.default)
], License.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Cost_entity_1.default, (cost) => cost.licenses),
    __metadata("design:type", Cost_entity_1.default)
], License.prototype, "cost", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Partner_entity_1.default, (partner) => partner.licenses),
    __metadata("design:type", Partner_entity_1.default)
], License.prototype, "partner", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Tranjection_entity_1.default, (tranjection) => tranjection.licenses),
    __metadata("design:type", Tranjection_entity_1.default)
], License.prototype, "tranjection", void 0);
License = __decorate([
    typeorm_1.Entity()
], License);
exports.License = License;
