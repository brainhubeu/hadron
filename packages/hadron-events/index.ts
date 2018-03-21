import constants from './src/constants/constants'
import eventsProvider from './src/eventsProvider';
import { EventEmitter } from 'events';
import { Lifetime } from '../hadron-core';


export default eventsProvider;

export const register = (container: any, config: any) => {
  if (container.take(constants.EVENT_EMITTER) === null) {
    container.register(constants.EVENT_EMITTER, EventEmitter, Lifetime.Singletone);
  }
  const eventsRegister = eventsProvider(container.take(constants.EVENT_EMITTER), config.events);
  container.register(constants.EVENT_REGISTER, eventsRegister);
}
