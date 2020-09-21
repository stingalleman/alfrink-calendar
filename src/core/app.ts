// /*
//  * Simple webscraper for https://alfrink.nl/agenda that also generates a iCal feed, one for every grade.
//  * Made by Sting Alleman (https://github.com/stingalleman)
//  */

// const puppeteer = require("puppeteer");
// const express = require("express");
// const moment = require("moment");
// const mongoose = require("mongoose");

// const ical = require("ical-generator");
// const calItemSchema = require("./models/calItem");

// // Set momentjs locate to NL
// moment.locale("nl");

// const app = express();

// // Define all the iCal's
// const cal0 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Alles)",
// 	url: "http://alleman.tech/alfrink/0",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal1 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 1)",
// 	url: "http://alleman.tech/alfrink/1",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal2 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 2)",
// 	url: "http://alleman.tech/alfrink/2",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal3 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 3)",
// 	url: "http://alleman.tech/alfrink/3",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal4 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 4)",
// 	url: "http://alleman.tech/alfrink/4",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal5 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 5)",
// 	url: "http://alleman.tech/alfrink/5",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });
// const cal6 = ical({
// 	domain: "http://alleman.tech",
// 	name: "Alfrink iCal (Leerjaar 6)",
// 	url: "http://alleman.tech/alfrink/6",
// 	ttl: 60 * 60 * 24,
// 	timezone: "Europe/Amsterdam",
// });

// // Connect to MongoDB
// mongoose
// 	.connect(`mongodb://${process.env.DB_HOST}/alfrink-cal`, {
// 		auth: {
// 			user: process.env.DB_USER,
// 			password: process.env.DB_PASS,
// 		},
// 		authSource: process.env.DB_AUTHSOURCE,
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	})
// 	.then(
// 		() => {
// 			console.log("Connected to MongoDB");
// 		},
// 		(err) => {
// 			console.log(`MongoDB connection failure: ${err}`);
// 		}
// 	);

// function createEvents() {
// 	cal0.clear();
// 	cal1.clear();
// 	cal2.clear();
// 	cal3.clear();
// 	cal4.clear();
// 	cal5.clear();
// 	cal6.clear();
// 	let c;
// 	for (c = 0; c <= 6; c++) {
// 		calItem.find({ grade: c }, function (err, result) {
// 			result.forEach(function (err, i) {
// 				if (result[i].grade == 0) {
// 					cal0.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 1) {
// 					cal1.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 2) {
// 					cal2.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 3) {
// 					cal3.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 4) {
// 					cal4.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 5) {
// 					cal5.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				} else if (result[i].grade == 6) {
// 					cal6.createEvent({
// 						start: result[i].start,
// 						summary: result[i].summary,
// 						location: result[i].location,
// 						allDay: result[i].allDay,
// 					});
// 				}
// 			});
// 		});
// 	}
// }

// app.get("/", function (req, res) {
// 	res.status(404);
// 	res.send(
// 		"404, get outta here!\nJe zoekt waarschijnlijk https://cal.alleman.tech/alfrink/leerjaar.\nLeerjaar kan 1 t/m 6 zijn, of alles"
// 	);
// });

// app.get("/alfrink/:klas", function (req, res) {
// 	console.log(
// 		`request to /alfrink/${req.params.klas}\nfrom IP: ${req.ip}\nHeaders: ${req.headers}`
// 	);
// 	if (req.params.klas == "alles") {
// 		cal0.serve(res);
// 	} else if (req.params.klas == 0) {
// 		cal0.serve(res);
// 	} else if (req.params.klas == 1) {
// 		cal1.serve(res);
// 	} else if (req.params.klas == 2) {
// 		cal2.serve(res);
// 	} else if (req.params.klas == 3) {
// 		cal3.serve(res);
// 	} else if (req.params.klas == 4) {
// 		cal4.serve(res);
// 	} else if (req.params.klas == 5) {
// 		cal5.serve(res);
// 	} else if (req.params.klas == 6) {
// 		cal6.serve(res);
// 	}
// });

// app.get("/alfrink/data/:klas", function (req, res) {
// 	calItem.find({ grade: req.params.klas }, function (err, result) {
// 		console.log(
// 			`Request to /alfrink/data/${req.params.klas}\nIP: ${req.ip}\nHeaders: ${req.headers}`
// 		);
// 		if (err) {
// 			console.log(err);
// 			res.send(err);
// 		} else {
// 			res.json(result);
// 		}
// 	});
// 	// }
// });

// app.get("/alfrink/run/:token", function (req, res) {
// 	if (req.params.token == process.env.RUNTOKEN) {
// 		main();
// 		res.json({
// 			successful: true,
// 			desc: "running main function",
// 		});
// 	} else {
// 		res.json({
// 			successful: false,
// 			desc: "invalid token",
// 		});
// 	}
// });

import express from "express";
// import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const app = express();

export default async (): Promise<void> => {
	app.get("/alfrink/data/:grade", async (req, res) => {
		res.json(
			await CalItem.find({ where: { grade: req.params.grade }, cache: false })
		);
	});

	app.get("/alfrink/data", async (req, res) => {
		res.json(await CalItem.find());
	});

	app.get("/alfrink/length", async (req, res) => {
		res.json({
			length: (await CalItem.find()).length,
		});
	});

	app.listen(process.env.WEBPORT || 3000, () =>
		console.log(`listening on http://localhost:${process.env.WEBPORT || 3000}`)
	);
};
