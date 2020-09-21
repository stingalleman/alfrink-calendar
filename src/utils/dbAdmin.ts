import { CalItem } from "../entities/calItem";
import { TypeormEntities } from "../entities";
import * as orm from "typeorm";

const arg = process.argv.slice(2);

async function initDB() {
	const db = await orm.createConnection({
		type: "postgres",
		host: process.env.DB_HOST,
		port: (process.env.DB_PORT as unknown) as number,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: TypeormEntities,
		synchronize: true,
		cache: false,
	});
	console.info("[DATABASE] Connected");
	return db;
}

initDB();

if (arg[0] === "DROP") {
	console.log("dropping CalItem DB");
} else {
	console.log("nothing to do!");
}
