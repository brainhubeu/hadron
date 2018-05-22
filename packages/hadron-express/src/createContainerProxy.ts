import { IContainer } from './types';

const createContainerProxy = (container: IContainer): any => {
  return new Proxy(
    {},
    {
      get(target, name) {
        return container.take(name as string);
      },
    },
  );
};

export default createContainerProxy;
