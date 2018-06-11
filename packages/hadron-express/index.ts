import hadronExpress from './src/hadronToExpress';
import * as express from 'express';
import * as bodyParser from 'body-parser';

export {
  Callback,
  IRoutesConfig,
  IRoute,
  Middleware,
  IContainer,
  IHadronExpressConfig,
} from './src/types';
import {
  IRoutesConfig,
  IContainer,
  IHadronExpressConfig,
  RoutePathsConfig,
} from './src/types';

export { Event } from './src/constants/eventNames';

export default hadronExpress;

export const register = (
  container: IContainer,
  config: IHadronExpressConfig,
) => {
  const port = process.env.PORT || 8080;
  const expressApp = express();
  expressApp.use(bodyParser.json());
  container.register('server', expressApp);
  container.register('serverListen', () => {
    expressApp.listen(port);
  });
  return hadronExpress(
    {
      routes: config.routes as IRoutesConfig,
      routePaths: config.routePaths as RoutePathsConfig,
    },
    container,
  );
};
