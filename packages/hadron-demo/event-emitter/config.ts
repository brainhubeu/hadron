import { ICallbackEvent } from '../../hadron-events/src/types';

const emitterConfig: any = {};
emitterConfig.listeners = [
  {
    name: 'LISTENER-1',
    event: 'someEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      const original = event.callback;
      // tslint:disable:no-console
      console.log('my name is LISTENER-1 and I listen to event someEvent');
      // TODO
      event.callback = () => {
        console.log('callback one');
        return original();
      };
    },
  },
  {
    name: 'LISTENER-2',
    event: 'createRoutesEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
        // tslint:disable:no-console
      console.log('my name is LISTENER-2 and I listen to event createRoutesEvent');
    },
  },
  {
    name: 'LISTENER-3',
    event: 'someEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      // const original = event.callback;
      // tslint:disable:no-console
      console.log('my name is LISTENER-3 and I listen to event someEvent');
    },
  },
];

export default emitterConfig;
