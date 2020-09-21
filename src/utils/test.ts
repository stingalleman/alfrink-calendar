import { createHash } from "crypto";

function generateID(input: string) {
	const hash = createHash("sha1")
		.update(JSON.stringify(input))
		.digest("base64");
	// .replace(/([^\d])+/gi, "");
	return hash;
}

const toHash =
	"Rapport-1 en rapport SE-1 uit ++ Aanmelden herkansingen SE-1 periode 5 havo en 6vwo via Magister t/m 11 december";
console.log(generateID(toHash));
console.log(createHash("sha1").update(JSON.stringify(toHash)).digest("hex"));
