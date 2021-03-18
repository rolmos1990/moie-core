import dotenv = require('dotenv');

import express = require('express');
import { loadControllers } from 'awilix-express';
import loadContainer from './container';
//import loadPersistence from './persistence';
import {createConnection} from "typeorm";
import MySQLPersistence from "./common/persistence/mysql.persistence";
import {Authorization} from './middlewares/authorization';
import * as cors from 'cors';

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

//require('dotenv').config();

const app: express.Application = express();

//use cors middleware
app.use(cors(options));

// JSON Support
app.use(express.json());
// CORS Support
//app.use(cors());

//persistence
//loadPersistence(app);

// Container

// JwT
//if (process.env.jwt_secret_key) {
    // app.use(jwt({
    //     secret: process.env.jwt_secret_key,
    //     algorithms: ['HS256']
    // }).unless({ path: ['/', '/check']}));
//}

// Controllers
createConnection(MySQLPersistence).then(async connection => {
    loadContainer(app);
    app.use(Authorization);
    app.use(loadControllers(
        'controllers/*.ts',
        { cwd: __dirname }
    ));
});

export { app };
