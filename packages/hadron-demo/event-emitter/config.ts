const emitterConfig: any = {};
emitterConfig.listeners = [
  {
    name: 'LISTENER-1',
    event: 'handleTerminateApplicationEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      const cb = () => {
        console.log('------------app ended---------------');
        callback(...args);
      }
      return cb();
    },
  },

  {
    name: 'LISTENER-2',
    event: 'handleInitializeApplicationEvent', // event to listen to
    handler: () => {
      console.log('-----------app started-----------')
    },
  },
];

export default emitterConfig;
