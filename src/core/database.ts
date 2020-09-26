import { Connection, createConnection } from "typeorm";
import { TypeormEntities } from "../entities";

export default async (): Promise<Connection> => {
	const db = await createConnection({
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
};
