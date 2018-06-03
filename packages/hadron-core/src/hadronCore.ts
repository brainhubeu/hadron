import container from './container/container';
import { IContainer } from './container/types';
import { createLogger } from 'bunyan';
const hadronDefaultConfig = {};

export const prepareConfig = (
  defaultConfig: object | Promise<object>,
  config: object | Promise<object>,
  logger: any,
) => {
  return Promise.all([defaultConfig, config])
    .then(([resolvedDefaultConfig, resolvedConfig]) => ({
      ...resolvedDefaultConfig,
      ...resolvedConfig,
    }))
    .catch((err) => {
      logger.error(`Config promise rejected: ${err}`);
      return defaultConfig;
    });
};

export default (
  server: any,
  packages: any[] = [],
  config: any = {},
): Promise<IContainer> => {
  container.register('server', server);

  const logger = createLogger({ name: 'hadron-logger' });
  container.register('hadronLogger', logger);

  return prepareConfig(hadronDefaultConfig, config, logger).then(
    (hadronConfig) => {
      return Promise.all(
        packages
          .filter(({ register }) => !!register)
          .map(({ register }) => register(container, hadronConfig)),
      ).then(() => container);
    },
  );
};
