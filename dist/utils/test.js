"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function generateID(input) {
    const hash = crypto_1.createHash("sha1")
        .update(JSON.stringify(input))
        .digest("base64");
    // .replace(/([^\d])+/gi, "");
    return hash;
}
const toHash = "Rapport-1 en rapport SE-1 uit ++ Aanmelden herkansingen SE-1 periode 5 havo en 6vwo via Magister t/m 11 december";
console.log(generateID(toHash));
console.log(crypto_1.createHash("sha1").update(JSON.stringify(toHash)).digest("hex"));
//# sourceMappingURL=test.js.map