import { ConnectionOptions } from "typeorm";

export default <ConnectionOptions> {
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "moie-lucy-backup",
    supportBigNumbers: true,
    bigNumberStrings: false,
    synchronize: false,
    logging: false,
    entities: [
        `${__dirname}/../../models_moie/**/*`
    ]
}
