import eventsManagerProvider from '@brainhubeu/hadron-events';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const config = {};

const eventsManager = eventsManagerProvider(emitter, config);

const listeners = [
  {
    name: 'LISTENER',
    event: 'testEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      const result = callback(...args);
      return `${result}-changed`;
    },
  },
];

eventsManager.registerEvents(listeners);

const callback = () => 'testcase';

const newCallback = eventsManager.emitEvent('testEvent', callback);
newCallback();
