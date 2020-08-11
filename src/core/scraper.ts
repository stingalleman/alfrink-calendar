import puppeteer from "puppeteer";
import moment from "moment";
import { CalItem } from "../entities/calItem";

export default async (): Promise<void> => {
	try {
		console.time("scrape");
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		let c;
		for (c = 0; c <= 6; c++) {
			let a;
			for (a = 1; a <= 12; a++) {
				// Cycle thru all months
				console.log(
					`Scraping maand ${a}, leerjaar ${c} (https://www.alfrink.nl/agenda?month=${a}&year=${moment().year()}&groep=${c})`
				);
				await page.goto(
					`https://www.alfrink.nl/agenda?month=${a}&year=${moment().year()}&groep=${c}`,
					{
						waitUntil: "networkidle0",
					}
				);
				const Date = await page.evaluate(() => {
					// eslint-disable-next-line no-undef
					const calmonth = document.querySelector(".calendar__month");
					return calmonth.textContent;
				});
				const dateData = Date.split(" - ");
				const data = await page.$$eval("table tr td", (tds) =>
					tds.map((td) => {
						if (td.className == "is-disabled") {
							return;
						} else {
							return (td as HTMLElement).innerText;
						}
					})
				);
				let i: number;
				for (i = 0; i < data.length; i++) {
					if (data[i] == undefined) {
						continue;
					} else if (!/^[0-9]*$/.test(data[i])) {
						const day = data[i].substring(0, 2);
						data[i] = data[i].slice(3);
						data[i] = data[i].replace(/(\r\n|\n|\r)/gm, " ++ ");
						const start = `${moment()
							.year(parseInt(dateData[1]))
							.format("YYYY")}-${moment()
							.month(dateData[0])
							.format("MM")}-${moment()
							.date(parseInt(day))
							.format("DD")}T10:10:10`;
						await CalItem.create({
							id: parseInt(`${a}${i}`),
							grade: c,
							start: start,
							summary: data[i],
							location: "Alfrink College",
							allDay: true,
						}).save();
						console.log("saved!");
					}
				}
			}
		}
		await browser.close();
		console.timeEnd("scrape");
	} catch (err) {
		console.log(`FAILURE ON SCRAPER FUNCTION, EXITING...\n${err}`);
		process.exit();
	}
};
