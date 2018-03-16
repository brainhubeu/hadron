interface CallbackEvent{
    callback: Function,
} 
export default {
  "my-listener": { //listener name
      event: 'someEvent', // event to listen to
      handler: (...params:any[]) => (event: CallbackEvent) => {
        let original = event.callback;
        event.callback = () => { 
            console.log(`My new implementation of event.callback as a developer`);
            return original(...params);    
        };
    }
  },

  "my-listener2": { //listener name
    event: 'someEvent', // event to listen to
    handler: (...params:any[]) => (event: CallbackEvent) => {
      console.log('lalalal')
      return event.callback;
      }
  },

  "my-listener3": { //listener name
    event: 'someEvent', // event to listen to
    handler: (...params:any[]) => (event: CallbackEvent) => {
      let original = event.callback;
      event.callback = () => { 
          console.log(`22222My new implementation of event.callback as a developer`);
          return original(...params);    
      };
  }
}
}



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