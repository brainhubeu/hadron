import eventsProvider from '../../../hadron-events/src/eventsProvider';
import { EventEmitter } from 'events';
import emitterConfig from '../config';

const emitter = new EventEmitter();

const callback = (...args: any[]) => {
  // tslint:disable-next-line
  console.log('Im a callback');
  // tslint:disable-next-line
  console.log();
}

const eventsRegister = eventsProvider(emitter, emitterConfig);
eventsRegister('someEvent', callback, 1, 2);
callback();

