import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    database: "projectg",
    entities: ["src/infrastructure/persistence/postgresql/schemas/*.js"],
    host: "localhost",
    password: "root",
    migrations: ["src/infrastructure/persistence/postgresql/migrations/*.js"],
    port: 5432,
    type: "postgres",
    username: "postgres"
})