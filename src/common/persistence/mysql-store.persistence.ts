import { ConnectionOptions } from "typeorm";

export default <ConnectionOptions> {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT!) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Panama2018.",
    database: "lucy_web",
    supportBigNumbers: true,
    bigNumberStrings: false,
    synchronize: false,
    logging: false,
    entities: [
        `${__dirname}/../../models/**/*`,
        `${__dirname}/../../models_moie/**/*`,
        `${__dirname}/../../models_web/**/*`,
    ]
}
