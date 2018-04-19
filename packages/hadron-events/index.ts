import { EventEmitter } from 'events';
import { Lifecycle, IContainer } from '@brainhubeu/hadron-core';

import eventManagerProvider from './src/eventManagerProvider';
import { IHadronEventsConfig } from './src/types';

export * from './src/types';
export default eventManagerProvider;

export const register = (
  container: IContainer,
  config: IHadronEventsConfig,
) => {
  if (container.take('eventEmitter') === null) {
    container.register('eventEmitter', EventEmitter, Lifecycle.Singleton);
  }
  const eventManager = eventManagerProvider(
    container.take('eventEmitter'),
    config.events,
  );
  eventManager.registerEvents(config.events.listeners);
  container.register('eventManager', eventManager);
};
