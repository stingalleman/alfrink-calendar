import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import database from "./core/database";
import app from "./core/app";
import scraper from "./core/scraper";
import { GenerateEvents } from "./cals";

const bootstrap = async (): Promise<void> => {
	try {
		await database();
		if (process.argv.slice(2)[0] === "scrape") await scraper();
		await app();
		await GenerateEvents();
	} catch (err) {
		console.log(`[BOOTSTRAP] FATAL ERROR: ${err}`);
	}
};

bootstrap();
