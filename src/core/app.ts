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
		const grade: number = req.params.grade.parseInt();
		if (grade < 0 || >6) grade = 0;

		cal[`cal${req.params.grade}`].serve(res);
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
		
		for(let i: number; i < 7; i++) {
			cal[`cal${i}`].clear();
		}
		
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
		
		const grade: number = req.params.grade.parseInt();
		if (grade < 0 || >6) grade = 0;

		res.json(cal[`cal${req.params.grade}`].toJSON());
	});

	app.listen(3000, () => console.log("listening on http://localhost:3000}"));
};
