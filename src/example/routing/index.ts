import * as express from "express";
import ConvertToExpress from "../../routing/routesToExpress";
import exampleRouting from "./routesConfig";

const port = process.env.PORT || 8080;

const expressApp = express();

ConvertToExpress(expressApp, exampleRouting);
expressApp.listen(port);
