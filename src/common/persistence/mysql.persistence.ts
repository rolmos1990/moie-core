import { ConnectionOptions } from "typeorm";

export default <ConnectionOptions> {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT!) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Panama2018.",
    database: process.env.DB_DATABASE || "moie-lucy-v2",
    supportBigNumbers: true,
    bigNumberStrings: false,
    synchronize: false,
    logging: false,
    entities: [
        `${__dirname}/../../models/**/*`
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ]
}

/**
 * Chunk para guardar lote de archivos grandes
 */
export const LIMIT_SAVE_BATCH = 5000;
