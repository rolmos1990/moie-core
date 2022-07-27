import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default <MysqlConnectionOptions> {
    name: "default",
    type: "mysql",
    insecureAuth: true,
    debug: false,
    trace: true,
/*    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT!) || 8889,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Panama2018.",*/
    host: "44.192.20.154",
    port: 3306,
    username: "root",
    password: "Panama2018.",
    database: process.env.DB_DATABASE || "moie-lucy-v2",
    supportBigNumbers: true,
    bigNumberStrings: false,
    synchronize: false,
    logging: false,
    entities: [
        `${__dirname}/../../models/**/*`,
        `${__dirname}/../../models_moie/**/*`,
        `${__dirname}/../../models_web/**/*`,
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ]
}
