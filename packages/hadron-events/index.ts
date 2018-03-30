<<<<<<< HEAD
import constants from './src/constants/constants';
=======
>>>>>>> remove constants, add hardcoded names
import eventsManagerProvider from './src/eventsMaganerProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '../hadron-core';

export * from './src/types';
export default eventsManagerProvider;

export const register = (container: any, config: any) => {
<<<<<<< HEAD
  if (container.take(constants.EVENT_EMITTER) === null) {
    container.register(
      constants.EVENT_EMITTER,
      EventEmitter,
      Lifetime.Singletone,
    );
  }
  const eventsManager = eventsManagerProvider(
    container.take(constants.EVENT_EMITTER),
    config.events,
  );
  eventsManager.registerEvents(config.events.listeners);
  container.register(constants.EVENTS_MANAGER, eventsManager);
};
=======
  if (container.take('event-emitter') === null) {
    container.register('event-emitter', EventEmitter, Lifetime.Singletone);
  }
  const eventsManager = eventsManagerProvider(container.take('event-emitter'), config.events);
  eventsManager.registerEvents(config.events.listeners);
  container.register('events-manager', eventsManager);
}
>>>>>>> remove constants, add hardcoded names
