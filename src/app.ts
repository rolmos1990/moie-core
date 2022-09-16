import dotenv = require('dotenv');

import express = require('express');
import { loadControllers } from 'awilix-express';
import loadContainer from './container';
import {createConnections} from "typeorm";
import {Authorization} from './middlewares/authorization';
import * as cors from 'cors';

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

const app = express();

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
