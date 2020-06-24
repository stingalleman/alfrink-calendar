/*
 * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed, one for every grade.
 * Made by Sting Alleman (https://github.com/stingalleman)
 */

const puppeteer = require("puppeteer");
const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");

const ical = require("ical-generator");
const calItemSchema = require("./models/calItem");

// Set momentjs locate to NL
moment.locale("nl");

const app = express();

// Define all the iCal's
const cal0 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Alles)",
	url: "http://alleman.tech/alfrink/0",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal1 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 1)",
	url: "http://alleman.tech/alfrink/1",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal2 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 2)",
	url: "http://alleman.tech/alfrink/2",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal3 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 3)",
	url: "http://alleman.tech/alfrink/3",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal4 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 4)",
	url: "http://alleman.tech/alfrink/4",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal5 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 5)",
	url: "http://alleman.tech/alfrink/5",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});
const cal6 = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal (Leerjaar 6)",
	url: "http://alleman.tech/alfrink/6",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});

// Connect to MongoDB
mongoose
	.connect(`mongodb://${process.env.DB_HOST}/alfrink-cal`, {
		auth: {
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
		},
		authSource: process.env.DB_AUTHSOURCE,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(
		() => {
			console.log("Connected to MongoDB");
		},
		(err) => {
			console.log(`MongoDB connection failure: ${err}`);
		}
	);

// Define DB models
const calItem = mongoose.model("calItem", calItemSchema);

/*
 * Cron: run every day at 5 AM (0 5 * * *)
 */

async function main() {
	try {
		// Delete all existing stuff in DB (to avoid duplicates)
		calItem.deleteMany({}, function (err) {
			if (err) {
				console.log("Error deleting existing db: " + err);
			} else {
				console.log("Deleted existing entries");
			}
		});
		const browser = await puppeteer.launch({
			headless: true,
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
				let dateData = await page.evaluate(() => {
					// eslint-disable-next-line no-undef
					const calmonth = document.querySelector(".calendar__month");
					return calmonth.textContent;
				});
				dateData = dateData.split(" - ");
				const data = await page.$$eval("table tr td", (tds) =>
					tds.map((td) => {
						if (td.className == "is-disabled") {
							return;
						} else {
							return td.innerText;
						}
					})
				);
				let i;
				for (i = 0; i < data.length; i++) {
					if (data[i] == undefined) {
						continue;
					} else if (/^[0-9]*$/.test(data[i]) == false) {
						data[i] = data[i].slice(3);
						data[i] = data[i].replace(/(\r\n|\n|\r)/gm, " ++ ");
						const event = await new calItem({
							grade: c,
							// prettier-ignore
							start: `${moment().year(dateData[1]).format("YYYY")}-${moment().month(dateData[0]).format("MM")}-${moment().date(i + 1).format("DD")}T10:10:10`,
							summary: data[i],
							location: "Alfrink College",
							allDay: true,
							date: {
								// prettier-ignore
								day: moment().date(i + 1).format("DD"),
								month: moment().month(dateData[0]).format("MM"),
								year: moment().year(dateData[1]).format("YYYY"),
							},
						});
						await event.save();
					}
				}
			}
		}
		await browser.close();
		// Weird invalid date? Just delete it rofl
		await calItem.deleteMany({ "date.day": 30, "date.month": 2 }, function (
			err,
			doc
		) {
			if (err) {
				console.log(`Error deleting weird date\n${err}`);
			} else {
				console.log(`Deleted weird dates!\n${JSON.stringify(doc)}`);
			}
		});
		createEvents();
	} catch (err) {
		console.log(`FAILURE ON SCRAPER FUNCTION, EXITING...\n${err}`);
		process.exit();
	}
}

function createEvents() {
	let c;
	for (c = 0; c <= 6; c++) {
		calItem.find({ grade: c }, function (err, result) {
			result.forEach(function (err, i) {
				if (result[i].grade == 0) {
					cal0.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 1) {
					cal1.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 2) {
					cal2.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 3) {
					cal3.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 4) {
					cal4.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 5) {
					cal5.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				} else if (result[i].grade == 6) {
					cal6.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				}
			});
		});
	}
}

main();

app.get("/", function (req, res) {
	res.status(404);
	res.send(
		"404, get outta here!\nJe zoekt waarschijnelijk https://cal.alleman.tech/alfrink/leerjaar.\nLeerjaar kan 1 t/m 6 zijn, of alles"
	);
});

app.get("/alfrink/:klas", function (req, res) {
	if (req.params.klas == "alles") {
		cal0.serve(res);
	} else if (req.params.klas == 0) {
		cal0.serve(res);
	} else if (req.params.klas == 1) {
		cal1.serve(res);
	} else if (req.params.klas == 2) {
		cal2.serve(res);
	} else if (req.params.klas == 3) {
		cal3.serve(res);
	} else if (req.params.klas == 4) {
		cal4.serve(res);
	} else if (req.params.klas == 5) {
		cal5.serve(res);
	} else if (req.params.klas == 6) {
		cal6.serve(res);
	}
});

app.get("/alfrink/data/:klas", function (req, res) {
	calItem.find({ grade: req.params.klas }, function (err, result) {
		console.log(`Request to /alfrink/data/${req.params.klas}`);
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(result);
		}
	});
	// }
});

app.get("/alfrink/run/:token", function (req, res) {
	if (req.params.token == process.env.RUNTOKEN) {
		main();
		res.json({
			successful: true,
			desc: "running main function",
		});
	} else {
		res.json({
			successful: false,
			desc: "invalid token",
		});
	}
});

app.listen("80", () => console.log("http://localhost:1223"));
