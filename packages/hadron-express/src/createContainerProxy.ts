import { IContainer } from './types';

const createContainerProxy = (container: IContainer) => {
  return new Proxy(
    {
      keys() {
        return container.keys();
      },
    },
    {
      get(target, name) {
        return container.take(name as string);
      },
    },
  );
};

export default createContainerProxy;
