import { createHash } from "crypto";

export function generateID(input: string): number {
	const hash = createHash("sha1")
		.update(JSON.stringify(input))
		.digest("base64")
		.replace(/([^\d])+/gi, "");
	return parseInt(hash);
}
