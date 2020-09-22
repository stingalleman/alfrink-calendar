import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const cal5 = ical({
	domain: "cal.alleman.tech",
	name: "Alfrink Agenda (Leerjaar 5)",
	ttl: 60 * 60 * 24,
});

export async function GenerateCal5(): Promise<ical.ICalCalendar> {
	const items = await CalItem.find({ where: { grade: 5 }, cache: false });

	items.forEach((doc) => {
		cal5.createEvent({
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

	return cal5;
}

export { cal5 };
