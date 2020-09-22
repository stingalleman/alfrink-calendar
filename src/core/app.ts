// /*
//  * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed, one for every grade.
//  * Made by Sting Alleman (https://github.com/stingalleman)
//  */

import express from "express";
import morgan from "morgan";

import scraper from "./scraper";
import { CalItem } from "../entities/calItem";
import * as cal from "../cals";

const app = express();

// logging
app.use(
	morgan(":remote-addr :method :url :status - :response-time ms (:user-agent)")
);

export default async (): Promise<void> => {
	app.get("/", async (req, res) => {
		res.send(
			"/alfrink/cal/:grade - ical feed<br/>/alfrink/data/:grade - json data<br/>/alfrink/data - alles<br/>/alfrink/length - hoeveelheid agenda-punten<br/><br/>debug dingen waar token voor nodig is:<br/><br/>/debug/scrape - force scrape de agenda<br/>/debug/clear - clear alle ical feeds<br/>/debug/generate - maak nieuwe ical events aan<br/>/debug/data/:grade - zie ical feed data in json"
		);
	});

	app.get("/alfrink/cal/:grade", async (req, res) => {
		if (req.params.grade === "0") cal.cal0.serve(res);
		else if (req.params.grade === "1") cal.cal1.serve(res);
		else if (req.params.grade === "2") cal.cal2.serve(res);
		else if (req.params.grade === "3") cal.cal3.serve(res);
		else if (req.params.grade === "4") cal.cal4.serve(res);
		else if (req.params.grade === "5") cal.cal5.serve(res);
		else if (req.params.grade === "6") cal.cal6.serve(res);
		else cal.cal0.serve(res);
	});

	app.get("/alfrink/data/:grade", async (req, res) => {
		res.json(
			await CalItem.find({ where: { grade: req.params.grade }, cache: false })
		);
	});

	app.get("/alfrink/data", async (req, res) => {
		res.json(await CalItem.find({ cache: false }));
	});

	app.get("/alfrink/length", async (req, res) => {
		res.json({
			length: (await CalItem.find()).length,
		});
	});

	/**
	 * debug stuff
	 */
	app.get("/debug/scrape", async (req, res) => {
		if (req.query.token !== process.env.DEBUG_TOKEN) {
			return res.send("nice try");
		}
		res.json("scraping...");
		await scraper();
	});
	app.get("/debug/clear", async (req, res) => {
		if (req.query.token !== process.env.DEBUG_TOKEN) {
			return res.send("nice try");
		}
		cal.cal0.clear();
		cal.cal1.clear();
		cal.cal2.clear();
		cal.cal3.clear();
		cal.cal4.clear();
		cal.cal5.clear();
		cal.cal6.clear();
		res.send("cleared all cal's");
	});
	app.get("/debug/generate", async (req, res) => {
		if (req.query.token !== process.env.DEBUG_TOKEN) {
			return res.send("nice try");
		}
		res.json(cal.GenerateEvents());
	});
	app.get("/debug/data/:grade", async (req, res) => {
		if (req.query.token !== process.env.DEBUG_TOKEN) {
			return res.send("nice try");
		}
		if (req.params.grade === "0") res.json(cal.cal0.toJSON());
		else if (req.params.grade === "1") res.json(cal.cal1.toJSON());
		else if (req.params.grade === "2") res.json(cal.cal2.toJSON());
		else if (req.params.grade === "3") res.json(cal.cal3.toJSON());
		else if (req.params.grade === "4") res.json(cal.cal4.toJSON());
		else if (req.params.grade === "5") res.json(cal.cal5.toJSON());
		else if (req.params.grade === "6") res.json(cal.cal6.toJSON());
		else res.json(cal.cal0.toJSON());
	});

	app.listen(process.env.WEBPORT || 3000, () =>
		console.log(`listening on http://localhost:${process.env.WEBPORT || 3000}`)
	);
};
