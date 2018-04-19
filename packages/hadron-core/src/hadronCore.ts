import container from './container/container';
import { IContainer } from './container/types';
import { createLogger } from 'bunyan';
const hadronDefaultConfig = {};

export default (
  server: any,
  packages: any[] = [],
  config: any = {},
): Promise<IContainer> => {
  container.register('server', server);

  container.register('hadronLogger', createLogger({ name: 'hadron-logger' }));

  const hadronConfig = { ...hadronDefaultConfig, ...config };

  return Promise.all(
    packages
      .filter(({ register }) => !!register)
      .map(({ register }) => register(container, hadronConfig)),
  ).then(() => container);
};
