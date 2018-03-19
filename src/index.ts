import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import './init';
import hadronToExpress from './routing/hadronToExpress';

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
