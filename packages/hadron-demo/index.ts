import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '@brainhubeu/hadron-core';
import * as hadronEvents from '@brainhubeu/hadron-events';
import * as hadronSerialization from '@brainhubeu/hadron-serialization';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronLogger from '@brainhubeu/hadron-logger';
import jsonProvider from '@brainhubeu/hadron-json-provider';
import expressConfig from './express-demo';
import typeormConfig from './typeorm-demo';
import emitterConfig from './event-emitter/config';
import loggerConfig from './logger';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import 'reflect-metadata';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider(['./routing/**/*'], ['js']).then((routes: any) => {
  const config = {
    ...typeormConfig,
    ...loggerConfig,
    events: emitterConfig,
    routes: {
      ...serializationRoutes,
      ...routes,
      ...expressConfig.routes,
    },
  };

  hadron(
    expressApp,
    [hadronEvents, hadronSerialization, hadronExpress, hadronLogger],
    config,
  ).then((container: IContainer) => {
    expressApp.use((req, res, next) =>
      res.status(404).json('Request not found.'),
    );
    container.register('customValue', 'From Brainhub with ❤️');
    setupSerializer();
    expressApp.listen(port);
  });

  return;
});
