import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const cal0 = ical({
	domain: "cal.alleman.tech",
	name: "Alfrink Agenda (Alles)",
	ttl: 60 * 60 * 24,
	prodId: {
		company: "Sting Alleman",
		product: "Alfrink iCal Feed",
		language: "NL",
	},
});

export async function GenerateCal0(): Promise<ical.ICalCalendar> {
	const items = await CalItem.find({ where: { grade: 0 }, cache: false });

	items.forEach((doc) => {
		cal0.createEvent({
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

	return cal0;
}

export { cal0 };
