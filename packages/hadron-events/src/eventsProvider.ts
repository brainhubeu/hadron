import { IEventEmitter } from './types';

/**
 * Provider function to inject emitter and config into variable scope
 * @param emitter event emitter
 * @param config config parameters
 */
const eventsProvider = (emitter: IEventEmitter, config: any) => {

  /**
   * Function registers list of listeners to given event and fires this event
   * @param emitter
   * @param config
   * @param eventName name of the event which will be called
   * @param emitter event emitter
   * @param callback function passed to listeners via .emit() call
   * @param listeners array of listeners
   * @param args arguments for callback functions
   */
  const eventsRegister = (eventName: string, callback: (...args: any[]) => any, ...args: any[]) => {

    if (eventName === '' || eventName === null) {
      throw new Error('eventName argument can not be empty');
    }

    if (emitter === null) {
      throw new Error('emitter object can not be null');
    }

    if (callback === null) {
      throw new Error('callback argument can not be null');
    }
    if (config.listeners === null) {
      throw new Error('listeners argument can not be null');
    }

    if (config.listeners.length === 0) {
      return;
    }

    if (args === null) {
      throw new Error('args argument can not be null');
    }

    const event = {
      callback,
    }
    // check if event has any listeners to avoid re-declaration of listener
    if (emitter.listeners(eventName).length === 0) {
      config.listeners.forEach((listener: any) => {
        if (listener.event === eventName) {
          emitter.on(eventName, listener.handler(...args));
        }
      });
    }
    emitter.emit(eventName, event);
  }
  return eventsRegister;
}
export default eventsProvider;
