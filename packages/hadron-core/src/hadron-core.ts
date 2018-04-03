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
      if (eventsManager) {
        eventsManager.emitEvent(eventsNames.HANDLE_INITIALIZE_APPLICATION_EVENT)();
        const terminateApplicationCallback = () => {
          process.exit();
        };
        const newTerminateApplicationCallback = eventsManager.
          emitEvent(eventsNames.HANDLE_TERMINATE_APPLICATION_EVENT, terminateApplicationCallback);
        process.on('SIGINT', newTerminateApplicationCallback);
      }

      return container;
    });
>>>>>>> emit event when packages are loaded
};
