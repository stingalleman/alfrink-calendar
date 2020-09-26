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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalItem = void 0;
const typeorm_1 = require("typeorm");
let CalItem = class CalItem extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn("text"),
    __metadata("design:type", String)
], CalItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("int"),
    __metadata("design:type", Number)
], CalItem.prototype, "grade", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", Object)
], CalItem.prototype, "start", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], CalItem.prototype, "summary", void 0);
__decorate([
    typeorm_1.Column("text", { default: "Alfrink College" }),
    __metadata("design:type", String)
], CalItem.prototype, "location", void 0);
__decorate([
    typeorm_1.Column("boolean", { default: true }),
    __metadata("design:type", Boolean)
], CalItem.prototype, "allDay", void 0);
CalItem = __decorate([
    typeorm_1.Entity()
], CalItem);
exports.CalItem = CalItem;
//# sourceMappingURL=calItem.js.map