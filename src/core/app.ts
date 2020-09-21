// /*
//  * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed, one for every grade.
//  * Made by Sting Alleman (https://github.com/stingalleman)
//  */

import express from "express";

import scraper from "./scraper";
import { CalItem } from "../entities/calItem";
import { cal0, GenerateEvents } from "../cals";

const app = express();

export default async (): Promise<void> => {
	app.get("/alfrink/cal/:grade", async (req, res) => {
		console.log(`hit from ${req.ip}`);
		cal0.serve(res);
	});

	app.get("/alfrink/data/:grade", async (req, res) => {
		res.json(
			await CalItem.find({ where: { grade: req.params.grade }, cache: false })
		);
	});

	app.get("/alfrink/data", async (req, res) => {
		res.json(await CalItem.find({ where: { grade: 0 }, cache: false }));
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
		await scraper();
		res.json("done");
	});
	app.get("/debug/find/:grade/:start", async (req, res) => {
		res.json(
			await CalItem.find({
				where: {
					grade: req.params.grade,
					start: req.params.start,
				},
			})
		);
	});
	app.get("/debug/clear", async (req, res) => {
		res.json(cal0.clear());
	});
	app.get("/debug/generate", async (req, res) => {
		res.json(GenerateEvents());
	});
	app.get("/debug/data", async (req, res) => {
		res.json(cal0.toJSON());
	});

	app.listen(process.env.WEBPORT || 3000, () =>
		console.log(`listening on http://localhost:${process.env.WEBPORT || 3000}`)
	);
};
