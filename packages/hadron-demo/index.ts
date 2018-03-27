import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import * as hadronEvents from '../hadron-events';
import * as hadronSerialization from '../hadron-serialization';
import * as hadronExpress from '../hadron-express';
import * as hadronTypeORM from '../hadron-typeorm';
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

    hadron(expressApp, [
      hadronEvents,
      hadronSerialization,
      hadronExpress,
      hadronTypeORM,
    ], config)
      .then((container: IContainer) => {
        container.register('customValue', 'From Brainhub with ❤️');
        setupSerializer();
        expressApp.listen(port);
      });

    return;
  });

  return;
});
