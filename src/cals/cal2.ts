import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const cal2 = ical({
	domain: "cal.alleman.tech",
	name: "Alfrink Agenda (Leerjaar 2)",
	ttl: 60 * 60 * 24,
	prodId: {
		company: "Sting Alleman",
		product: "Alfrink iCal Feed",
		language: "NL",
	},
});

export async function GenerateCal2(): Promise<ical.ICalCalendar> {
	const items = await CalItem.find({ where: { grade: 2 }, cache: false });

	items.forEach((doc) => {
		cal2.createEvent({
			start: doc.start,
			summary: doc.summary,
			allDay: doc.allDay,
			appleLocation: {
				title: "Alfrink College",
				address: "Werflaan 45, 2725 DE Zoetermeer",
				radius: 40,
				geo: {
					lat: 52.071,
					lon: 4.502,
				},
			},
			transparency: "TRANSPARENT",
		});
	});

	return cal2;
}

export { cal2 };
