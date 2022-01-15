import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default <MysqlConnectionOptions> {
    type: "mysql",
    host: "localhost",
    port: 6603,
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
