import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default <MysqlConnectionOptions> {
    name: "lucy_web",
    type: "mysql",
    insecureAuth: true,
    debug: false,
    trace: true,
    //host: "127.0.0.1",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT!) || 8889,
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
