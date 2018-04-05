import container from './container/container';
import { IContainer } from './container/types';
const hadronDefaultConfig = {};

export default (
  server: any,
  packages: any[] = [],
  config: any = {},
): Promise<IContainer> => {
  container.register('server', server);

  const hadronConfig = { ...hadronDefaultConfig, ...config };

  return Promise.all(
    packages
      .filter(({ register }) => !!register)
      .map(({ register }) => register(container, hadronConfig)),
  ).then(() => container);
};
