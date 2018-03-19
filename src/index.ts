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

const dbConnection = createDatabaseConnection('mysql', 'mysql', 'localhost', 3306, 'root', 'my-secret-pw', 'test');
dbConnection.entities = ['./entity/**/*.ts'];
const connectionOption = (dbConnection as ConnectionOptions);

createConnection(connectionOption)
  .then(async connection => {
    container.register('teamRepository', connection.getRepository<Team>('team'));
    container.register('userRepository', connection.getRepository<User>('user'));

    const port = process.env.PORT || 8081;
    const expressApp = express();

    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
    hadronToExpress(expressApp, exampleRouting);
    expressApp.listen(port);
  });
