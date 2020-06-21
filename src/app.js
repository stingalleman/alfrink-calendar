const puppeteer = require("puppeteer");
const express = require("express");
const moment = require("moment");
const ical = require("ical-generator");
const cron = require("node-cron");

// prettier-ignore
const cal = ical({ domain: "http://alleman.tech", name: "Alfrink iCal", url: "http://alleman.tech/alfrink", ttl: 60 * 60 * 24, timezone: "Europe/Amsterdam" });
moment.locale("nl");

const app = express();
const calData = {};

async function init() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		let a;
		for (a = 1; a <= 12; a++) {
			await page.goto(`https://www.alfrink.nl/agenda?month=${a}&year=${moment().year()}`, {
				waitUntil: "networkidle0",
			});
		}
		await browser.close();
		return calData;
	} catch (err) {
		console.log("error: " + err);
	}
}

init();

app.get("/", function (req, res) {
	res.send("/alfrink of /alfrink/data");
});

app.get("/alfrink", function (req, res) {
	cal.serve(res);
});

app.get("/alfrink/data", function (req, res) {
	res.json(calData);
});

app.listen("1223", () => console.log("http://localhost:1223"));
