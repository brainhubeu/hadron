import hadronExpress from './src/hadronToExpress';
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

export default hadronExpress;

export const register = (container: IContainer, config: IHadronExpressConfig) =>
  hadronExpress(
    {
      routes: config.routes as IRoutesConfig,
      routePaths: config.routePaths as RoutePathsConfig,
    },
    container,
  );
