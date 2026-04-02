import { DataSource } from "typeorm"
export default new DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: "admin",
    password: "Qwerty1542!",
    database: "nestjs_blog_application",
    entities: ["**/*.entity.js"],
    migrations: ["migrations/*.js"]
})