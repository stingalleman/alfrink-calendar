const puppeteer = require("puppeteer");
const express = require("express");
const moment = require("moment");
const ical = require("ical-generator");
const cron = require("node-cron");
const mongoose = require("mongoose");

moment.locale("nl");

const app = express();

const cal = ical({
	domain: "http://alleman.tech",
	name: "Alfrink iCal",
	url: "http://alleman.tech/alfrink",
	ttl: 60 * 60 * 24,
	timezone: "Europe/Amsterdam",
	// events: calEvents,
});

mongoose
	.connect("mongodb://192.168.178.150/alfrink-cal", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(
		() => {
			console.log("connected to mongodb!");
		},
		(err) => {
			console.log(`Mongoose error: ${err}`);
		}
	);
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

async function init() {
	try {
		calItem.deleteMany({}, function (err) {
			if (err) {
				console.log("error deleting db: " + err);
			} else {
				console.log("deleted!");
			}
		});
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		let a;
		for (a = 1; a <= 12; a++) {
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
						console.log(td);
						return td.innerText;
					}
				})
			);
			let i;
			for (i = 0; i < data.length; i++) {
				if (data[i] == undefined) {
					console.log("undefined");
				} else if (/^[0-9]*$/.test(data[i]) == false) {
					data[i] = data[i].slice(3);
					data[i] = data[i].replace(/(\r\n|\n|\r)/gm, " +++ ");
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
					console.log("push!");
				}
			}
		}
		await browser.close();
		createEvents();
	} catch (err) {
		console.log("error: " + err);
		process.exit();
	}
}

function createEvents() {
	calItem.find({}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			result.forEach(function (err, i) {
				let x = i;
				console.log(x);
				console.log(result[x].start);

				cal.createEvent({
					start: result[x].start,
					summary: result[x].summary,
					location: result[x].location,
					allDay: result[x].allDay,
				});
			});
		}
	});
}

init();

app.get("/", function (req, res) {
	res.send("/alfrink of /alfrink/data");
});

app.get("/alfrink", function (req, res) {
	cal.serve(res);
});

app.get("/alfrink/data", function (req, res) {});

app.listen("1223", () => console.log("http://localhost:1223"));
