import eventsManagerProvider from '../../../hadron-events/src/eventsMaganerProvider';
import { EventEmitter } from 'events';
import emitterConfig from '../config';

const emitter = new EventEmitter();

const callback = (...args: any[]) => {
  // tslint:disable-next-line
  console.log('Im a callback');
  // tslint:disable-next-line
  console.log();
}

const eventsManager = eventsManagerProvider(emitter, emitterConfig);
eventsManager.emitEvent('someEvent', callback);
callback();

