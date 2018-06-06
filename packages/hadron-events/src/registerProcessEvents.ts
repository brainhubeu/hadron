import { IEventManager } from './types';
import { Event } from './constants';

export default (eventEmitter: IEventManager) => {
  process.on('exit', () => {
    eventEmitter.emitEvent(Event.HANDLE_TERMINATE_APPLICATION_EVENT);
  });
};
