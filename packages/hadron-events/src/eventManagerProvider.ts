import { hasFunctionArgument } from './helpers/functionHelper';
import { IEventEmitter, IEventListener } from './types';

/**
 * Provider function to inject emitter and config into variable scope
 * @param emitter event emitter
 * @param config config parameters
 */
const eventManagerProvider = (emitter: IEventEmitter, config: any) => ({
  registerEvents: (listeners: IEventListener[]) => {
    listeners.forEach((listener: any) => {
      if (listener.event === '' || listener.event === null) {
        throw new Error('eventName can not be empty');
      }
      emitter.on(listener.event, listener.handler);
    });
  },
  emitEvent: (eventName: string, callback: () => any) => {
    if (eventName === '' || eventName === null) {
      throw new Error('eventName can not be empty');
    }

    if (callback === undefined || callback === null) {
      callback = () => {
        return null;
      };
    }

    return emitter
      .listeners(eventName)
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
      }, callback);
  },
});

export default eventManagerProvider;
