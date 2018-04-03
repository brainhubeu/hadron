import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import expressConfig from './express';
import typeormConfig from './typeorm';
import jsonProvider from '../hadron-json-provider';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import loggerConfig from './logger';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider(['./routing/**/*'], ['js']).then((routes) => {
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
    [
      import('../hadron-events'),
      import('../hadron-serialization'),
      import('../hadron-express'),
      import('../hadron-typeorm'),
      import('../hadron-logger'),
    ],
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
