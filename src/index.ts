import * as bodyParser from 'body-parser';
import * as express from 'express';
import { ConnectionOptions, createConnection } from 'typeorm';
import container from './containers/container';
import { Team } from './entity/Team';
import { User } from './entity/User';
import exampleRouting from './example/routing/routesConfig';
import './init';
import hadronToExpress from './routing/hadronToExpress';
import { createDatabaseConnection } from './typeorm/connectionHelper';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const port = process.env.PORT || 8080;
const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
hadronToExpress(expressApp, exampleRouting);
expressApp.listen(port);
