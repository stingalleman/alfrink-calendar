"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cal4 = exports.GenerateCal4 = void 0;
const ical_generator_1 = __importDefault(require("ical-generator"));
const calItem_1 = require("../entities/calItem");
const cal4 = ical_generator_1.default({
    domain: "cal.alleman.tech",
    name: "Alfrink Agenda (Leerjaar 4)",
    ttl: 60 * 60 * 24,
});
exports.cal4 = cal4;
async function GenerateCal4() {
    const items = await calItem_1.CalItem.find({ where: { grade: 4 }, cache: false });
    items.forEach((doc) => {
        cal4.createEvent({
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
    return cal4;
}
exports.GenerateCal4 = GenerateCal4;
//# sourceMappingURL=cal4.js.map