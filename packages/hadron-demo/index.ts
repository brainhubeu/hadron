import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '@brainhubeu/hadron-core';
import * as hadronEvents from '@brainhubeu/hadron-events';
import * as hadronSerialization from '@brainhubeu/hadron-serialization';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronLogger from '@brainhubeu/hadron-logger';
import * as hadronTypeOrm from '@brainhubeu/hadron-typeorm';
import * as hadronAuth from '@brainhubeu/hadron-auth';
import jsonProvider from '@brainhubeu/hadron-json-provider';
import expressConfig from './express-demo';
import typeormConfig from './typeorm-demo/index';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import 'reflect-metadata';
import securedRoutes from './security/securedRoutesConfig';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider([`${__dirname}/routing/*`], ['config.js']).then((routes: any) => {
  const config = {
    securedRoutes,
    ...typeormConfig,
    ...hadronLogger,
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
      hadronAuth,
      hadronEvents,
      hadronSerialization,
      hadronTypeOrm,
      hadronExpress,
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
