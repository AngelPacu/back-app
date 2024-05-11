import { DataSource } from "typeorm";
// npm install dotenv
import 'dotenv/config';

export const dataSource = new DataSource({
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    entities: ["src/infrastructure/persistence/postgresql/schemas/*.js"],
    migrations: ["src/infrastructure/persistence/postgresql/migrations/*.js"],
    type: "postgres",
})