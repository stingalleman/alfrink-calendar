"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entities_1 = require("../entities");
exports.default = async () => {
    const db = await typeorm_1.createConnection({
        type: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        entities: entities_1.TypeormEntities,
    });
    console.info("[DATABASE] Connected");
    return db;
};
//# sourceMappingURL=database.js.map