import IEventEmitter from './IEventEmitter';
import IEventListener from './IEventListener';

/**
 * Function registers list of listeners to given event and fires this event
 * @param eventName name of the event which will be called
 * @param emitter event emitter
 * @param callback function passed to listeners via .emit() call
 * @param listeners array of listeners
 * @param args arguments for callback functions
 */
const eventsRegister = (eventName: string,
    emitter: IEventEmitter, callback: () => any,
    listeners: IEventListener[], ...args: any[]) => {

  if (eventName === '' || eventName === null) {
    throw new Error('eventName argument can not be empty');
  }

  if (emitter === null) {
    throw new Error('emitter object can not be null');
  }

  if (callback === null) {
    throw new Error('callback argument can not be null');
  }

  if (listeners === null) {
    throw new Error('listeners argument can not be null');
  }

  if (listeners.length === 0) {
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
    listeners.forEach(listener => {
      if (listener.event === eventName) {
        emitter.on(eventName, listener.handler(...args));
      }
    })
  }
  emitter.emit(eventName, event);
}
export default eventsRegister;
