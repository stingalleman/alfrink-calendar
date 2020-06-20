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

cron.schedule("0 5 * * *", async function () {
	try {
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		await page.goto("https://www.alfrink.nl/agenda", {
			waitUntil: "networkidle0",
		});
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
				calData[i] = {
					// prettier-ignore
					date: `${moment().year(dateData[1]).format("YYYY")}-${moment().month(dateData[0]).format("MM")}-${moment().date(i + 1).format("DD")}T10:10:10`,
					info: data[i],
				};
				cal.createEvent({
					// prettier-ignore
					start: `${moment().year(dateData[1]).format("YYYY")}-${moment().month(dateData[0]).format("MM")}-${moment().date(i + 1).format("DD")}T10:10:10`,
					summary: data[i],
					location: "Alfrink College",
					allDay: true,
				});
				console.log("push!");
			}
		}
		await browser.close();
		return calData;
	} catch (err) {
		console.log("error: " + err);
	}
});

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
