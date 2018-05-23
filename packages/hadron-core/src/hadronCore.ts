import container from './container/container';
import { IContainer } from './container/types';
import { createLogger } from 'bunyan';
const hadronDefaultConfig = {};

const prepareConfig = (config: object | Promise<object>) => {
  return Promise.resolve(config).then((resolvedConfig) => ({
    ...hadronDefaultConfig,
    ...resolvedConfig,
  }));
};

export default (
  server: any,
  packages: any[] = [],
  config: any = {},
): Promise<IContainer> => {
  container.register('server', server);

  container.register('hadronLogger', createLogger({ name: 'hadron-logger' }));

  return prepareConfig(config).then((hadronConfig) => {
    return Promise.all(
      packages
        .filter(({ register }) => !!register)
        .map(({ register }) => register(container, hadronConfig)),
    ).then(() => container);
  });
};
