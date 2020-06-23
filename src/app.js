/*
 * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed.
 * Made by Sting Alleman (https://github.com/stingalleman)
 */

const puppeteer = require("puppeteer");
const express = require("express");
const moment = require("moment");
// eslint-disable-next-line no-unused-vars
const cron = require("node-cron");
const mongoose = require("mongoose");

const cal = require("./cal.js");
const config = require("./config.json");
const calItemSchema = require("./models/calItem");

// Set momentjs locate to NL
moment.locale("nl");

const app = express();

// Connect to MongoDB
mongoose
	.connect("mongodb://83.84.118.250/alfrink-cal", {
		auth: {
			user: config.db.user,
			password: config.db.password,
		},
		authSource: "admin",
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
 * Scrape https://alfrink.nl/agenda for every month
 * Cron: run every day at 5 AM
 */

// cron.schedule("0 5 * * *", async function () {

async function init() {
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
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		let c;
		for (c = 1; c <= 6; c++) {
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
		calItem.findOneAndRemove({ "date.day": 30, "date.month": 2 }, function (
			err,
			doc
		) {
			if (err) {
				console.log(`Error deleting weird date\n${err}`);
			} else {
				console.log(`Deleted weird date\n${doc}!`);
			}
		});
	} catch (err) {
		console.log(`FAILURE ON MAIN FUNCTION, EXITING...\n${err}`);
		process.exit();
	}
}

// init();

app.get("/", function (req, res) {
	res.status(404);
	res.send(
		"not found, get outta here! (you're probaly looking for /alfrink or /alfrink/data)"
	);
});

app.get("/alfrink/:klas", function (req, res) {
	if (req.params.klas == 0) {
		res.send(cal.cal0.serve);
	}
});

app.get("/alfrink/data/:klas", function (req, res) {
	if (req.params.klas == 0) {
		calItem.find({}, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.json(result);
			}
		});
	} else {
		calItem.find({ grade: req.params.klas }, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.json(result);
			}
		});
	}
});

app.listen("1223", () => console.log("http://localhost:1223"));
