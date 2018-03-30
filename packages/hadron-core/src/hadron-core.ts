import container from './container/container';
import LoadingPackageError from './errors/LoadingPackageError';
import { eventsNames } from './constants/eventsNames';
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
        .catch((err) => {
          console.error(new LoadingPackageError(err));
        }),
<<<<<<< HEAD
    ),
  ).then(() => container);
=======
      ),
    ).then(() => {
      const eventsManager = container.take('events-manager');
      eventsManager.emitEvent(eventsNames.HANDLE_INITIALIZE_APPLICATION_EVENT);
      return container;
    });
>>>>>>> emit event when packages are loaded
};
