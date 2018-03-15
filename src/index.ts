import * as express from 'express';
import routesConfig from './example/routing/routesConfig';
import './init';
import routesToExpress from './routing/routesToExpress';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/

const port = process.env.PORT || 8080;

const expressApp = express();

routesToExpress(expressApp, routesConfig);
expressApp.listen(port);
