import hadron, { IContainer } from '@brainhubeu/hadron-core';
import * as hadronEvents from '@brainhubeu/hadron-events';
import * as hadronSerialization from '@brainhubeu/hadron-serialization';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronTypeORM from '@brainhubeu/hadron-typeorm';
import jsonProvider from '@brainhubeu/hadron-json-provider';
import expressConfig from './express-demo';
import typeormConfig from './typeorm-demo';
import emitterConfig from './event-emitter/config';
import loggerConfig from './logger';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import 'reflect-metadata';

jsonProvider(['./routing/*'], ['js']).then((routes: any) => {
  const config = {
    ...typeormConfig,
    ...loggerConfig,
    events: emitterConfig,
    routes: {
      ...expressConfig.routes,
      ...serializationRoutes,
      ...routes,
    },
  };

  hadron(
    [hadronExpress, hadronEvents, hadronSerialization, hadronTypeORM],
    config,
  ).then((container: IContainer) => {
    container
      .register('server')
      .use((req, res) => res.status(404).json('Request not found.'));
    container.register('customValue', 'From Brainhub with ❤️');
    setupSerializer();
    container.take('server_listen')();
  });

  return;
});
