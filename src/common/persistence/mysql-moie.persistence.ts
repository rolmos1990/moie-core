import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default <MysqlConnectionOptions> {
    type: "mysql",
    insecureAuth: true,
    debug: false,
    trace: true,
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "Panama2018.",
    database: "moie-lucy",
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