import eventsManagerProvider from './src/eventsMaganerProvider';
export * from './src/constants';
import { EventEmitter } from 'events';
import { EVENT_EMITTER, EVENTS_MANAGER } from './src/constants';

export * from './src/types';
export default eventsManagerProvider;

export const register = (container: any, config: any) => {
  if (container.take(EVENT_EMITTER) === null) {
    container.register(
      constants.EVENT_EMITTER,
      EventEmitter,
      Lifetime.Singletone,
    );
  }
  const eventsManager = eventsManagerProvider(
    container.take(EVENT_EMITTER),
    config.events,
  );
  eventsManager.registerEvents(config.events.listeners);
  container.register(EVENTS_MANAGER, eventsManager);
};
