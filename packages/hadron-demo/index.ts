import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '../hadron-core';
import expressConfig from './express';
import typeormConfig from './typeorm';
import jsonProvider from '../hadron-json-provider';
import emitterConfig from './event-emitter/config';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider(['./routing/**/*'], ['js'])
  .then(routes => {

    const config = {
      ...typeormConfig,
      events: emitterConfig,
      routes: {
        ...routes,
        ...expressConfig.routes,
      },
    }

    hadron(expressApp, [
      import('../hadron-events'),
      import('../hadron-express'),
      import('../hadron-typeorm'),
    ], config)
      .then((container: IContainer) => {
        container.register('customValue', 'From Brainhub with ❤️');

        expressApp.listen(port);
      });

    return;
  });
