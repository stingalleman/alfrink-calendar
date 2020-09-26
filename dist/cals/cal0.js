"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cal0 = exports.GenerateCal0 = void 0;
const ical_generator_1 = __importDefault(require("ical-generator"));
const calItem_1 = require("../entities/calItem");
const cal0 = ical_generator_1.default({
    domain: "cal.alleman.tech",
    name: "Alfrink Agenda (Alles)",
    ttl: 60 * 60 * 24,
});
exports.cal0 = cal0;
async function GenerateCal0() {
    const items = await calItem_1.CalItem.find({ where: { grade: 0 }, cache: false });
    items.forEach((doc) => {
        cal0.createEvent({
            start: doc.start,
            summary: doc.summary,
            allDay: doc.allDay,
            appleLocation: {
                title: "Alfrink College",
                address: "Werflaan 45, 2725 DE Zoetermeer",
                radius: 40,
                geo: {
                    lat: 52.071,
                    lon: 4.502,
                },
            },
            transparency: "TRANSPARENT",
        });
    });
    return cal0;
}
exports.GenerateCal0 = GenerateCal0;
//# sourceMappingURL=cal0.js.map