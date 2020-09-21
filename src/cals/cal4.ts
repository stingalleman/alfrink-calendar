import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const cal4 = ical({
	domain: "cal.alleman.tech",
	name: "Alfrink (Grade 4)",
});

export async function GenerateCal4(): Promise<ical.ICalCalendar> {
	const items = await CalItem.find({ where: { grade: 4 }, cache: false });

	items.forEach((doc) => {
		cal4.createEvent({
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

	return cal4;
}

export { cal4 };
