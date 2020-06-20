const ical = require("ical-generator");
const http = require("http");
const moment = require("moment");
const cal = ical({ domain: "alleman.tech", name: "my first iCal" });

// overwrite domain
cal.domain("sebbo.net");

cal.createEvent({
	start: moment(),
	end: moment().add(1, "hour"),
	summary: "Example Event",
	description: "It works ;)",
	location: "my room",
	url: "http://sebbo.net/",
});

http
	.createServer(function (req, res) {
		cal.serve(res);
	})
	.listen(3000, "127.0.0.1", function () {
		console.log("Server running at http://127.0.0.1:3000/");
	});
