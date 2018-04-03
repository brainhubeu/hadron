import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import expressConfig from './express';
import typeormConfig from './typeorm';
import jsonProvider from '../hadron-json-provider';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import { customResponses } from '../hadron-express';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(customResponses);

jsonProvider(['./routing/**/*'], ['js']).then((routes) => {
  const config = {
    ...typeormConfig,
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
    ], config)
      .then((container: IContainer) => {
        // @ts-ignore
        expressApp.use((req, res, next) => res.notFound('Request not found.'));
        container.register('customValue', 'From Brainhub with ❤️');
        setupSerializer();
        expressApp.listen(port);
      });

    return;
  });

