import IEventListener from "events/IEventListener";
import ICallbackEvent from './ICallbackEvent';

const listeners: IEventListener[] = [
    { 
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: (...params:any[]) => (event: ICallbackEvent) => {
          let original = event.callback;
          event.callback = () => { 
              return original(...params);    
          };
  
      }
    },
  
     { //listener name
      name: 'my-listener-2',
      event: 'someEvent', // event to listen to
      handler: (...params:any[]) => (event: ICallbackEvent) => {
        console.log('hihihihihihihi');
        return event.callback;
        }
    },
  
    { 
      name: 'my-listener-3',
      event: 'someEvent', // event to listen to
      handler: (...params:any[]) => (event: ICallbackEvent) => {
        
        let original = event.callback;
        event.callback = () => { 
            return "sss";  
        };
    }
  }
]
export default listeners;

/*export default {
    "listener-name": { //my-listener
        event: 'callback', // Hadron.CALLBACK
        handler: (database:any) => (event: CallbackEvent) => {
          let original = event.callback;
          event.callback = (params: any) => { 
              console.log(`Request to: ${event.path} lllperformed`);
              return original(params);    
          };
      }
    }
  }*/


