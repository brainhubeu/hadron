import { ICallbackEvent } from 'hadron-events';

const emitterConfig: any = {};
emitterConfig.listeners = [
  {
    name: 'LISTENER-2',
    event: 'createRoutesEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      const result = callback(...args);
      return result;
    },
  },
];

export default emitterConfig;
