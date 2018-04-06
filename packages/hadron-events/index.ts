import eventManagerProvider from './src/eventManagerProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '@brainhubeu/hadron-core';

export * from './src/types';
export default eventManagerProvider;

export const register = (container: any, config: any) => {
  if (container.take('event-emitter') === null) {
    container.register('event-emitter', EventEmitter, Lifetime.Singletone);
  }
  const eventManager = eventManagerProvider(
    container.take('event-emitter'),
    config.events,
  );
  eventManager.registerEvents(config.events.listeners);
  container.register('event-manager', eventManager);
};
