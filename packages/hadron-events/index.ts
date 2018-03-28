import constants from './src/constants/constants'
import eventsManagerProvider from './src/eventsMaganerProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '../hadron-core';

export * from './src/types';
export default eventsManagerProvider;


export const register = (container: any, config: any) => {
  if (container.take(constants.EVENT_EMITTER) === null) {
    container.register(constants.EVENT_EMITTER, EventEmitter, Lifetime.Singletone);
  }
  const eventsManager = eventsManagerProvider(container.take(constants.EVENT_EMITTER), config.events);
  eventsManager.registerEvents(config.events.listeners);
  container.register(constants.EVENTS_MANAGER, eventsManager);
}
