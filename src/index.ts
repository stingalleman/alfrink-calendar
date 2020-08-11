import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import database from "./core/database";
import app from "./core/app";
import scraper from "./core/scraper";

const bootstrap = async (): Promise<void> => {
	await database();
	await app();
	// /*
	//  * Cron: run every day at 5 AM (0 5 * * *)
	//  */
	await scraper();
};

bootstrap();
