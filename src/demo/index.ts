import * as bodyParser from "body-parser";
import * as express from "express";
import { ConnectionOptions, createConnection } from "typeorm";
import container from "../containers/container";
import { Team } from "../entity/Team";
import { User } from "../entity/User";
import routesToExpress from "../routing/routesToExpress";
import { createDatabaseConnection } from "../typeorm/connectionHelper";
import { IRoutesConfig } from "../types/routing";
import jsonProvider from "../util/json-provider";

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const setupDatabase = (): Promise<void> => {
    const dbConnection = createDatabaseConnection("mysql", "mysql", "localhost", 3306, "root", "my-secret-pw", "test");
    dbConnection.entities = [ "../entity/**/*.ts" ];
    const connectionOption = (dbConnection as ConnectionOptions);

    return createConnection(connectionOption)
        .then((connection) => {
            container.register("teamRepository", connection.getRepository<Team>("team"));
            container.register("userRepository", connection.getRepository<User>("user"));
        });
};

setupDatabase().then(async () => {
            const port = process.env.PORT || 8080;
            const expressApp = express();
            expressApp.use(bodyParser.json());

            await jsonProvider(["./routing/**/*"], "config", "development", ["js"])
            .then((exampleRouting) => {
                routesToExpress(expressApp, exampleRouting as IRoutesConfig);
                // expressApp.use(bodyParser.urlencoded({extended: true}));
                expressApp.listen(port);
                return;
            });
        });
