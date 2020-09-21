import ical from "ical-generator";
import { CalItem } from "../entities/calItem";

const cal3 = ical({
	domain: "cal.alleman.tech",
	name: "Alfrink (Grade 3)",
});

export async function GenerateCal3(): Promise<ical.ICalCalendar> {
	const items = await CalItem.find({ where: { grade: 3 }, cache: false });

	items.forEach((doc) => {
		cal3.createEvent({
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

	return cal3;
}

export { cal3 };
