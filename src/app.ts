import dotenv = require('dotenv');

import express = require('express');
import { loadControllers } from 'awilix-express';
import loadContainer from './container';
import {createConnection} from "typeorm";
import MySQLPersistence from "./common/persistence/mysql.persistence";
import {Authorization} from './middlewares/authorization';
import * as cors from 'cors';
import {RunSeed} from "./seeds/run.seed";

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
app.use(express.json({limit: '50mb'}));
app.use('/css', express.static('css'));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('../storage/uploads'));
app.use('/pdf', express.static('../storage/uploads'));

//Blocked use for this directories

// JSON Support
app.use(express.json());

// Controllers
createConnection(MySQLPersistence).then(async connection => {
    loadContainer(app);
    app.use(Authorization); //disable validation
    app.use(loadControllers(
        'controllers/*.ts',
        { cwd: __dirname }
    ));
    app.use(Authorization, express.static('storage'));
    if(process.env.SEED_DB) {
        new RunSeed();
    }
});

export { app };
