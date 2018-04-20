import hadronExpress from './src/hadronToExpress';
export {
  Callback,
  IRoutesConfig,
  IRoute,
  Middleware,
  IContainer,
  IHadronExpressConfig,
} from './src/types';
import { IRoutesConfig, IContainer, IHadronExpressConfig } from './src/types';

export default hadronExpress;

export const register = (container: IContainer, config: IHadronExpressConfig) =>
  hadronExpress((config.routes as IRoutesConfig) || {}, container);
