import dotenv = require('dotenv');

import express = require('express');
import { loadControllers } from 'awilix-express';
import loadContainer from './container';
//import loadPersistence from './persistence';
import {createConnection, createConnections} from "typeorm";
import MySQLPersistence from "./common/persistence/mysql.persistence";
import {Authorization} from './middlewares/authorization';
import * as cors from 'cors';
import {loadModules} from "awilix/lib/load-modules";
import {load} from "dotenv";
import {RunSeed} from "./seeds/run.seed";
import {
    MySQLMoiePersistenceConnection,
    MySQLMoieStorePersistenceConnection,
    MySQLPersistenceConnection
} from "./common/persistence";

//options for cors midddleware
const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization'
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "*",
    preflightContinue: false,
};

const app: express.Application = express();

//use cors middleware
app.use(cors(options));

// JSON Support
app.use(express.json());

// Controllers
createConnections([{...MySQLPersistenceConnection}, {...MySQLMoiePersistenceConnection}, {...MySQLMoieStorePersistenceConnection}]).then(async connection => {
    loadContainer(app);
/*    app.use(Authorization); //disable validation*/
    app.use(loadControllers(
        'controllers/*.ts',
        { cwd: __dirname }
    ));
});

export { app };
