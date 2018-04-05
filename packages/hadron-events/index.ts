import eventsManagerProvider from './src/eventsManagerProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '@brainhubeu/hadron-core';

export * from './src/types';
export default eventsManagerProvider;

export const register = (container: any, config: any) => {
  if (container.take('event-emitter') === null) {
    container.register('event-emitter', EventEmitter, Lifetime.Singletone);
  }
  const eventsManager = eventsManagerProvider(
    container.take('event-emitter'),
    config.events,
  );
  eventsManager.registerEvents(config.events.listeners);
  container.register('events-manager', eventsManager);
};
