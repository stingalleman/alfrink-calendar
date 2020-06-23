function cal0() {
	const ical = require("ical-generator");
	const mongoose = require("mongoose");

	const config = require("./config.json");
	const calItemSchema = require("./models/calItem");

	mongoose
		.connect("mongodb://83.84.118.250/alfrink-cal", {
			auth: {
				user: config.db.user,
				password: config.db.password,
			},
			authSource: "admin",
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(
			() => {
				console.log("Connected to MongoDB");
			},
			(err) => {
				console.log(`MongoDB connection failure: ${err}`);
			}
		);
	const calItem = mongoose.model("calItem", calItemSchema);

	// Init iCal feed
	const cal00 = ical({
		domain: "http://alleman.tech",
		name: "Alfrink iCal (Alles)",
		url: "http://alleman.tech/alfrink/0",
		ttl: 60 * 60 * 24,
		timezone: "Europe/Amsterdam",
	});
	calItem.find({ grade: 0 }, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			try {
				result.forEach(function (err, i) {
					if (err) {
						console.log(err);
					}
					cal00.createEvent({
						start: result[i].start,
						summary: result[i].summary,
						location: result[i].location,
						allDay: result[i].allDay,
					});
				});
				console.log("created events!");
			} catch (err) {
				console.log(`error trying to make events:\n${err}`);
			}
		}
	});
	return cal00.serve;
}

module.exports.cal0 = cal0;
