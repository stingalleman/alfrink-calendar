/*
 * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed.
 * Made by Sting Alleman (https://github.com/stingalleman)
 */

const puppeteer = require("puppeteer");
const express = require("express");
const moment = require("moment");
const ical = require("ical-generator");
const cron = require("node-cron");
const mongoose = require("mongoose");

// Set momentjs locate to NL
moment.locale("nl");

const app = express();

// Init iCal feed
const cal = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal",
	url: "http://alleman.tech/alfrink",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
});

// Connect to MongoDB
mongoose
	.connect("mongodb://192.168.178.150/alfrink-cal", {
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
const Schema = mongoose.Schema;
const calItemSchema = new Schema({
	start: { type: String, default: "date" },
	summary: { type: String, default: "summary" },
	location: { type: String, default: "Alfrink College" },
	allDay: { type: Boolean, default: true },
	date: {
		// prettier-ignore
		day: { type: Number, default: 11 },
		month: { type: Number, default: 11 },
		year: { type: Number, default: 1111 },
	},
});
const calItem = mongoose.model("calItem", calItemSchema);

function createEvents() {
	calItem.find({}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			try {
				result.forEach(function (err, i) {
					if (err) {
						console.log(err);
					}
					cal.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				});
				console.log("created events!");
			} catch (err) {
				console.log(`error trying to make events:\n${err}`);
			}
		}
	});
}

/*
 * Scrape https://alfrink.nl/agenda for every month
 * Cron: run every day at 5 AM
 */

cron.schedule("0 5 * * *", async function () {
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
		let a;
		for (a = 1; a <= 12; a++) {
			// Cycle thru all months
			console.log(
				`Scraping month ${a} (https://www.alfrink.nl/agenda?month=${a}&year=${moment().year()})`
			);
			await page.goto(
				`https://www.alfrink.nl/agenda?month=${a}&year=${moment().year()}`,
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
		await browser.close();
		// Weird invalid date? Just delete it rofl
		calItem.findOneAndDelete({ "date.day": 30, "date.month": 2 }, function (
			err,
			doc
		) {
			if (err) {
				console.log(`Error deleting weird date\n${err}`);
			} else {
				console.log(`Deleted weird date\n${doc}!`);
			}
		});

		createEvents();
	} catch (err) {
		console.log(`FAILURE ON MAIN FUNCTION, EXITING...\n${err}`);
		process.exit();
	}
});

app.get("/", function (req, res) {
	res.status(404);
	res.send(
		"not found, get outta here! (you're probaly looking for /alfrink or /alfrink/data)"
	);
});

app.get("/alfrink", function (req, res) {
	cal.serve(res);
});

app.get("/alfrink/data", function (req, res) {
	calItem.find({}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

app.listen("1223", () => console.log("http://localhost:1223"));
