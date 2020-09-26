"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cal1 = exports.GenerateCal1 = void 0;
const ical_generator_1 = __importDefault(require("ical-generator"));
const calItem_1 = require("../entities/calItem");
const cal1 = ical_generator_1.default({
    domain: "cal.alleman.tech",
    name: "Alfrink Agenda (Leerjaar 1)",
    ttl: 60 * 60 * 24,
});
exports.cal1 = cal1;
async function GenerateCal1() {
    const items = await calItem_1.CalItem.find({ where: { grade: 1 }, cache: false });
    items.forEach((doc) => {
        cal1.createEvent({
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
    return cal1;
}
exports.GenerateCal1 = GenerateCal1;
//# sourceMappingURL=cal1.js.map