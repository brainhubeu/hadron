import eventManagerProvider, { IEventsConfig } from '@brainhubeu/hadron-events';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const config = {} as IEventsConfig;

const eventManager = eventManagerProvider(emitter, config);

const listeners = [
  {
    name: 'LISTENER',
    event: 'testEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      const time1 = Date.now();
      callback(...args);
      const time2 = Date.now();
      return time2 - time1;
    },
  },
];

eventManager.registerEvents(listeners);

const callback = () => 'testcase';

const newCallback = eventManager.emitEvent('testEvent', callback);
newCallback();
