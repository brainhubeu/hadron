import IEventListener from './IEventListener';
import ICallbackEvent from './ICallbackEvent';


const listeners: IEventListener[] = [
  {
    name: 'my-listener-1',
    event: 'someEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      const original = event.callback;
      event.callback = () => {
        return original(...params);
      }
    },
  },

  {
    name: 'my-listener-2',
    event: 'someEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      console.log('hihihihihihihi');
      return event.callback;
    },
  },

  {
    name: 'my-listener-3',
    event: 'someEvent', // event to listen to
    handler: (...params: any[]) => (event: ICallbackEvent) => {
      const original = event.callback;
      event.callback = () => {
        return 'sss';
      };
    },
  },
]
export default listeners;
