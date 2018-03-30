import hadronExpress from './src/hadronToExpress';
export {
  Callback,
  IRoutesConfig,
  IRoute,
  Middleware,
  IContainer,
} from './src/types';
import { IRoutesConfig } from './src/types';

export default hadronExpress;

export const register = (container: any, config: any) =>
  hadronExpress((config.routes as IRoutesConfig) || {}, container);
