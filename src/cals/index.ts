import { GenerateCal0, cal0 } from "./cal0";
import { GenerateCal1, cal1 } from "./cal1";
import { GenerateCal2, cal2 } from "./cal2";
import { GenerateCal3, cal3 } from "./cal3";
import { GenerateCal4, cal4 } from "./cal4";
import { GenerateCal5, cal5 } from "./cal5";
import { GenerateCal6, cal6 } from "./cal6";

export async function GenerateEvents(): Promise<void> {
	console.log("[CAL] Generating events...");
	await GenerateCal0();
	await GenerateCal1();
	await GenerateCal2();
	await GenerateCal3();
	await GenerateCal4();
	await GenerateCal5();
	await GenerateCal6();
}

export { cal0, cal1, cal2, cal3, cal4, cal5, cal6 };
// export { cal0 };
