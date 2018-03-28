
const emitterConfig: any = {};
emitterConfig.listeners = [
  {
    name: 'LISTENER-2',
    event: 'createRoutesEvent', // event to listen to
    handler: (callback: any, ...args: any[]) => {
      console.log(Date.now());
      const result = callback(...args);
      console.log(Date.now());
      return 'to';
    },
  },
];

export default emitterConfig;
