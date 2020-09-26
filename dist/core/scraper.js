"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const moment_1 = __importDefault(require("moment"));
const calItem_1 = require("../entities/calItem");
const crypto_1 = require("crypto");
moment_1.default.locale("NL");
exports.default = async () => {
    try {
        console.time("scrape");
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        let c;
        for (c = 0; c <= 6; c++) {
            let a;
            for (a = 1; a <= 12; a++) {
                // Cycle thru all months
                console.log(`Scraping maand ${a}, leerjaar ${c} (https://www.alfrink.nl/agenda?month=${a}&year=${moment_1.default().year()}&groep=${c})`);
                await page.goto(`https://www.alfrink.nl/agenda?month=${a}&year=${moment_1.default().year()}&groep=${c}`, {
                    waitUntil: "networkidle0",
                });
                const Date = await page.evaluate(() => {
                    // eslint-disable-next-line no-undef
                    const calmonth = document.querySelector(".calendar__month");
                    return calmonth.textContent;
                });
                const dateData = Date.split(" - ");
                const data = await page.$$eval("table tr td", (tds) => tds.map((td) => {
                    if (td.className == "is-disabled") {
                        return;
                    }
                    else {
                        return td.innerText;
                    }
                }));
                let i;
                for (i = 0; i < data.length; i++) {
                    if (data[i] == undefined) {
                        continue;
                    }
                    else if (!/^[0-9]*$/.test(data[i])) {
                        const day = data[i].substring(0, 2);
                        data[i] = data[i].slice(3);
                        data[i] = data[i].replace(/(\r\n|\n|\r)/gm, " ++ ");
                        await calItem_1.CalItem.create({
                            id: `_${c}_${i}_${a}_${crypto_1.createHash("sha1")
                                .update(JSON.stringify(data[i]))
                                .digest("base64")}`,
                            grade: c,
                            start: moment_1.default()
                                .year(parseInt(dateData[1]))
                                .month(dateData[0])
                                .date(parseInt(day))
                                .hour(10)
                                .minute(0)
                                .second(0)
                                .toISOString(),
                            summary: data[i],
                            location: "Alfrink College",
                            allDay: true,
                        }).save();
                    }
                }
            }
        }
        await browser.close();
        console.timeEnd("scrape");
    }
    catch (err) {
        console.log(`FAILURE ON SCRAPER FUNCTION, EXITING...\n${err}`);
        // process.exit();
    }
};
//# sourceMappingURL=scraper.js.map