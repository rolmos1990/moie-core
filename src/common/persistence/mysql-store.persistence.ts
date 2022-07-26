import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default <MysqlConnectionOptions> {
    name: "lucy_web",
    type: "mysql",
    insecureAuth: true,
    debug: false,
    trace: true,
    //host: "127.0.0.1",
    host: "44.192.20.154",
    port: 3306,
    username: "root",
    password: "Panama2018.",
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
