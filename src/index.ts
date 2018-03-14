import * as express from "express";

import exampleRouting from "./example/routing/routesConfig";
import "./init";
import hadronToExpress from "./routing/hadronToExpress";

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/

const port = process.env.PORT || 8080;

const expressApp = express();

hadronToExpress(expressApp, exampleRouting);

expressApp.listen(port);
