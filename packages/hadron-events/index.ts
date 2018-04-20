import eventManagerProvider from './src/eventManagerProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '@brainhubeu/hadron-core';

export * from './src/types';
export default eventManagerProvider;

export const register = (container: any, config: any) => {
  if (container.take('eventEmitter') === null) {
    container.register('eventEmitter', EventEmitter, Lifetime.Singleton);
  }
  const eventManager = eventManagerProvider(
    container.take('eventEmitter'),
    config.events,
  );
  eventManager.registerEvents(config.events.listeners);
  container.register('eventManager', eventManager);
};
