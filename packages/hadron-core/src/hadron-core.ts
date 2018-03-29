import container from './container/container'
import LoadingPackageError from './errors/LoadingPackageError';
const hadronDefaultConfig = {};

export default (server: any, packages: Array<Promise<any>>, config: any) => {
  container.register('server', server);

  const hadronConfig = { ...hadronDefaultConfig, ...config };
  return Promise.all(
    packages.map((pack: Promise<any>) =>
      pack
        .then(({ register }) => {
          if (register) {
            register(container, hadronConfig);
          }
        })
        .catch(err => {
          console.error(new LoadingPackageError(err));
        }),
      ),
    ).then(() => container);
};
