const puppeteer = require("puppeteer");
const express = require("express");
// const moment = require("moment");
// const ical = require("ical-generator");
// const cron = require("node-cron");

const app = express();
const calData = [];

async function init() {
	try {
		const browser = await puppeteer.launch({
			headless: true,
		});
		const page = await browser.newPage();
		await page.goto("https://www.alfrink.nl/agenda", {
			waitUntil: "networkidle0",
		});
		const data = await page.$$eval("table tr td", (tds) =>
			tds.map((td) => {
				return td.innerText;
			})
		);
		let i;
		for (i = 0; i < data.length; i++) {
			if (/^[0-9]*$/.test(data[i]) == false) {
				calData.push(data[i]);
				console.log(data[i]);
			}
			// console.log(/^[0-9]*$/.test(data[i]));
		}
		await browser.close();
		return calData;
	} catch (err) {
		console.log("error: " + err);
		process.exit();
	}
}

app.get("/", function (req, res) {
	res.send(calData);
});

app.listen("1223", () => console.log("http://localhost:1223"));

init();
