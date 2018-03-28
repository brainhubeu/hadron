import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '@hadron/core';
import * as hadronEvents from '@hadron/events';
import * as hadronSerialization from '@hadron/serialization';
import * as hadronExpress from '@hadron/express';
import expressConfig from './express-demo';
import typeormConfig from './typeorm-demo';
import jsonProvider from '@hadron/json-provider';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import loggerConfig from './logger';
import 'reflect-metadata';

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

  hadron(expressApp, [
    hadronEvents,
    hadronSerialization,
    hadronExpress,
  ], config)
    .then((container: IContainer) => {
      container.register('customValue', 'From Brainhub with ❤️');
      setupSerializer();
      expressApp.listen(port);
    });

  return;
});
