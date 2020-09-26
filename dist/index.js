"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const database_1 = __importDefault(require("./core/database"));
const app_1 = __importDefault(require("./core/app"));
const scraper_1 = __importDefault(require("./core/scraper"));
const cals_1 = require("./cals");
const bootstrap = async () => {
    try {
        await database_1.default();
        await app_1.default();
        if (process.argv.slice(2)[0] === "scrape")
            await scraper_1.default();
        await cals_1.GenerateEvents();
    }
    catch (err) {
        console.log(`[BOOTSTRAP] FATAL ERROR: ${err}`);
    }
};
bootstrap();
//# sourceMappingURL=index.js.map