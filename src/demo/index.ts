import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Container as container } from '../../packages/hadron-core';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { register as expressRegister } from '../../packages/hadron-express';
import { createDatabaseConnection, register as typeormRegister } from '../../packages/hadron-typeorm';
import jsonProvider from '../../packages/hadron-json-provider';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
const expressApp = express();
expressApp.use(bodyParser.json());
const port = process.env.PORT || 8080;

container.register('server', expressApp);

expressApp.listen(port);

jsonProvider(['./routing/**/*'], ['js'])
  .then(exampleRouting => {
    expressRegister(container, { routes: exampleRouting });
    return;
  });

const setupDatabase = (): Promise<void> => {
  const dbConnection = createDatabaseConnection('mysql', 'mysql', 'localhost', 3306, 'root', 'my-secret-pw', 'test');
  dbConnection.entities = ['../entity/*.ts'];

  return typeormRegister(container, {
    connections: [dbConnection],
    entities: [Team, User],
  });
}

setupDatabase();
