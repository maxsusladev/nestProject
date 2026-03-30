import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(config: ConfigService): Promise<void> {
    const AppdataSource = await new DataSource({
        type: 'postgres',
        host: config.get('database.host'),
        port: +config.get('database.port'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        synchronize: config.get('database.synchronize'),
    }).initialize()

    await AppdataSource.dropDatabase();
    await AppdataSource.destroy()
}