const puppeteer = require("puppeteer");
const express = require("express");
// const moment = require("moment");
// const ical = require("ical-generator");
// const cron = require("node-cron");

const app = express();
const calData = {};

async function init() {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			slowMo: 500,
		});
		const page = await browser.newPage();
		await page.goto("https://www.alfrink.nl/agenda", {
			waitUntil: "networkidle0",
		});
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
				console.log("nothing");
			} else if (/^[0-9]*$/.test(data[i]) == false) {
				data[i] = data[i].slice(3);
				data[i] = data[i].replace(/(\r\n|\n|\r)/gm, " + ");
				calData[i] = {
					day: i + 1,
					info: data[i],
				};
				console.log("push!");
			}
		}
		await browser.close();
		return calData;
	} catch (err) {
		console.log("error: " + err);
		process.exit();
	}
}

app.get("alfrink/data", function (req, res) {
	res.json(calData);
});

app.listen("1223", () => console.log("http://localhost:1223"));

init();
