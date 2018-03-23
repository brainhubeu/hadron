import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import expressConfig from './express';
import typeormConfig from './typeorm';
import jsonProvider from '../hadron-json-provider';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider(['./routing/**/*'], ['js'])
  .then(routes => {

    const config = {
      ...typeormConfig,
      events: emitterConfig,
      routes: {
        ...serializationRoutes,
        ...routes,
        ...expressConfig.routes,
      },
    };

    hadron(expressApp, [
      import('../hadron-events'),
      import('../hadron-serialization'),
      import('../hadron-express'),
      import('../hadron-typeorm'),
    ], config)
      .then((container: IContainer) => {
        container.register('customValue', 'From Brainhub with ❤️');
        setupSerializer();
        expressApp.listen(port);
      });

    return;
  });
