import * as bodyParser from 'body-parser';
import * as express from 'express';
import exampleRouting from './example/routing/routesConfig';
import './init';
import hadronExpress from '../packages/hadron-express';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const port = process.env.PORT || 8080;
const expressApp = express();

expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded

hadronExpress.register(expressApp, Container, { routes: exampleRouting });

expressApp.listen(port);
