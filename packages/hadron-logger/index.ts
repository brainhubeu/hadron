import logger, { register } from './src/logger';

export default logger;

export {
  register,
};

// export const register = (container: any, config: any) =>
//   hadronExpress(config.routes as IRoutesConfig || {}, container);
