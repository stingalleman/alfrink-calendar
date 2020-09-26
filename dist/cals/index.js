"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cal6 = exports.cal5 = exports.cal4 = exports.cal3 = exports.cal2 = exports.cal1 = exports.cal0 = exports.GenerateEvents = void 0;
const cal0_1 = require("./cal0");
Object.defineProperty(exports, "cal0", { enumerable: true, get: function () { return cal0_1.cal0; } });
const cal1_1 = require("./cal1");
Object.defineProperty(exports, "cal1", { enumerable: true, get: function () { return cal1_1.cal1; } });
const cal2_1 = require("./cal2");
Object.defineProperty(exports, "cal2", { enumerable: true, get: function () { return cal2_1.cal2; } });
const cal3_1 = require("./cal3");
Object.defineProperty(exports, "cal3", { enumerable: true, get: function () { return cal3_1.cal3; } });
const cal4_1 = require("./cal4");
Object.defineProperty(exports, "cal4", { enumerable: true, get: function () { return cal4_1.cal4; } });
const cal5_1 = require("./cal5");
Object.defineProperty(exports, "cal5", { enumerable: true, get: function () { return cal5_1.cal5; } });
const cal6_1 = require("./cal6");
Object.defineProperty(exports, "cal6", { enumerable: true, get: function () { return cal6_1.cal6; } });
async function GenerateEvents() {
    console.log("[CAL] Generating events...");
    await cal0_1.GenerateCal0();
    await cal1_1.GenerateCal1();
    await cal2_1.GenerateCal2();
    await cal3_1.GenerateCal3();
    await cal4_1.GenerateCal4();
    await cal5_1.GenerateCal5();
    await cal6_1.GenerateCal6();
}
exports.GenerateEvents = GenerateEvents;
// export { cal0 };
//# sourceMappingURL=index.js.map