import { ICallbackEvent } from '@brainhubeu/hadron-events';

const emitterConfig: any = {};
emitterConfig.listeners = [
  {
    name: 'LISTENER-1',
    event: 'handleTerminateApplicationEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      const cb = () => {
        callback(...args);
      };
      return cb();
    },
  },

  {
    name: 'LISTENER-2',
    event: 'handleInitializeApplicationEvent', // event to listen to
    handler: () => {
      // console.log('-----------app started-----------')
    },
  },
];

export default emitterConfig;
