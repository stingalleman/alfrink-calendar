const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	grade: { type: Number, defaut: 0 },
	start: { type: String, default: "date" },
	summary: { type: String, default: "summary" },
	location: { type: String, default: "Alfrink College" },
	allDay: { type: Boolean, default: true },
	date: {
		// prettier-ignore
		day: { type: Number, default: 11 },
		month: { type: Number, default: 11 },
		year: { type: Number, default: 1111 },
	},
});
