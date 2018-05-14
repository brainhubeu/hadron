import { IContainer } from './types';
const createContainerProxy = (container: IContainer) => {
  return new Proxy(
    {
      keys() {
        return container.keys();
      },
    },
    {
      get(target: any, name) {
        if (typeof target[name] === 'function') {
          return target[name];
        }
        return container.take(name as string);
      },
    },
  );
};

export default createContainerProxy;
