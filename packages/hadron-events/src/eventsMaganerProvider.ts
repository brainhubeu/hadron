import { hasFunctionArgument } from './helpers/functionHelper';
import { IEventEmitter } from './types';

/**
 * Provider function to inject emitter and config into variable scope
 * @param emitter event emitter
 * @param config config parameters
 */
const eventsManagerProvider = (emitter: IEventEmitter, config: any) => ({
  registerEvents: (eventName: string) => {
    if (eventName === '' || eventName === null) {
      throw new Error('eventName can not be empty');
    }
    config.listeners.forEach((listener: any) => {
      if (listener.event === eventName) {
        emitter.on(eventName, listener.handler);
      }
    });
  },
  emitEvent: (eventName: string, callback: () => any) => {
    if (eventName === '' || eventName === null) {
      throw new Error('eventName can not be empty');
    }
    return emitter
    .listeners(eventName)
    .reverse()
    .reduce((prevCallback, currentHandler) => {
    // is first argument called "callback?"
      if (!hasFunctionArgument(currentHandler, 'callback')) {
        return (...args: any[]) => {
          currentHandler(...args);
        // manually run callback
          return prevCallback(...args);
        };
      }
      return (...args: any[]) => currentHandler(prevCallback, ...args);
    }, callback)
  },
});


export default eventsManagerProvider;
