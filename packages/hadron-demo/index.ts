import * as bodyParser from 'body-parser';
import * as express from 'express';
import hadron, { IContainer } from '@brainhubeu/hadron-core';
import * as hadronEvents from '@brainhubeu/hadron-events';
import * as hadronSerialization from '@brainhubeu/hadron-serialization';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronLogger from '@brainhubeu/hadron-logger';
import * as hadronTypeOrm from '@brainhubeu/hadron-typeorm';
import jsonProvider from '@brainhubeu/hadron-json-provider';
import expressConfig from './express-demo';
import typeormConfig from './typeorm-demo/index';
import emitterConfig from './event-emitter/config';
import serializationRoutes from './serialization/routing';
import { setupSerializer } from './serialization/serialization-demo';
import 'reflect-metadata';
import HadronSecurity, {
  IRoleProvider,
  IRole,
  IUser,
  expressMiddlewareProvider,
  generateTokenMiddleware,
} from '@brainhubeu/hadron-security';
import securityConfig from './security/securityConfig';
import TypeOrmUserProvider from './security/TypeOrmUserProvider';
import TypeOrmRoleProvider from './security/TypeOrmRoleProvider';

const port = process.env.PORT || 8080;
const expressApp = express();
expressApp.use(bodyParser.json());

jsonProvider(['packages/hadron-demo/routing/*'], ['config.js']).then(
  (routes: any) => {
    const config = {
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
      [hadronEvents, hadronSerialization, hadronTypeOrm],
      config,
    ).then(async (container: IContainer) => {
      const userProvider = new TypeOrmUserProvider(
        container.take('userRepository'),
      );
      const roleProvider = new TypeOrmRoleProvider(
        container.take('roleRepository'),
      );

      const security: HadronSecurity = await securityConfig(
        userProvider,
        roleProvider,
      );

      expressApp.post('/login', generateTokenMiddleware(security));

      expressApp.use(expressMiddlewareProvider(security));

      hadronExpress.register(container, config);

      expressApp.use((req, res, next) =>
        res.status(404).json('Request not found.'),
      );
      container.register('customValue', 'From Brainhub with ❤️');

      setupSerializer();
      expressApp.listen(port);
    });

    return;
  },
);
