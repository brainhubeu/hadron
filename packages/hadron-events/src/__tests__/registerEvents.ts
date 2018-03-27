/* tslint:disable */
import { expect } from 'chai';
import { EventEmitter } from 'events';
import * as sinon from 'sinon';
import { ICallbackEvent } from '../types';
import { IEventListener } from '../types';
import eventsManagerProvider from '../eventsMaganerProvider';
import { hasFunctionArgument } from '../helpers/functionHelper';

describe('events registration', () => {
    let listeners: IEventListener[] = null;
    let emitter: EventEmitter = null;
    let args = null;
    let callback = null;
    let config = null;
    let eventsManager = null;
    beforeEach(() => {

    });

    afterEach(() => {
        listeners = null;
        emitter = null;
        args = null;
        callback = null;
        config = null;
        eventsManager = null;
        });

    it('throws an error if eventName is either null or empty string', () => {
        listeners = [
            { 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: (callback, ...args)  => {
                    return callback(...args);
              }
            },
          
             { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: (callback, ...args)  => {
                return callback(...args);
                }
            },
          
            { 
              name: 'my-listener-3',
              event: 'someEvent', // event to listen to
              handler: (callback, ...args)  => {
                return callback(...args);
            }
          }
        ]

        config = {};
        config.listeners = listeners;
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, config)
        expect(() => eventsManager.registerEvents('')).to.throw();
    });

    it('registers listeners functions from config', () => {

        emitter = new EventEmitter();


        const spy1 = () => sinon.spy();
        const spy2 = (callback, ...args) => sinon.spy();
        const tab = [spy1, spy2];

        listeners = [
            {
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: spy1
            },
          
             { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: spy2
             }
        ]

        eventsManager = eventsManagerProvider(emitter, { listeners });
        
        eventsManager.registerEvents('someEvent');
        expect(emitter.listeners('someEvent').length).to.equal(2);
        expect(emitter.listeners('someEvent')[0]).to.equal(spy1);
        expect(emitter.listeners('someEvent')[1]).to.equal(spy2);

    });
});


/////////////////////////////////////////////////////

describe("events emitting", () => {
    let listeners: IEventListener[] = null;
    let emitter: EventEmitter = null;
    let args = null;
    let callback = null;
    let config = null;
    let eventsManager = null;

    beforeEach(() => {
        callback = (...args) => {
            return 'hello world';
        }
    });

    afterEach(() => {
    listeners = null;
    emitter = null;
    args = null;
    callback = null;
    config = null;
    eventsManager = null;
    });
    it('throws error when eventName argument is either null or empty string', () => {
        listeners = [
            { 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: ()  => {
                  console.log('listener1');
              }
            },
          
             { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: ()  => {
                 console.log('yo');
                }
            },
          
            { 
              name: 'my-listener-3',
              event: 'changeCallbackEvent', // event to listen to
              handler: (callback, ...args)  => {
                let newCallback = (...args) => {
                    return 'changed';
                }
                return newCallback(...args);              
            }
          }
        ]

        config = {};
        config.listeners = listeners;
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, config)
        eventsManager.registerEvents('changeCallbackEvent');
        eventsManager.registerEvents('someEvent');
        

        expect(() => eventsManager.emitEvent('', callback)).throw();
    });

    it('calls emitter.listeners with eventName argument', () => {

        listeners = [
            { 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: ()  => {
                  console.log('listener1');
              }
            },
          
             { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: ()  => {
                 console.log('yo');
                }
            },
          
            {
              name: 'my-listener-3',
              event: 'changeCallbackEvent', // event to listen to
              handler: (callback, ...args)  => {
                let newCallback = (...args) => {
                    return 'changed';
                }
                return newCallback(...args);                
            }
          }
        ]

        config = {};
        config.listeners = listeners;
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, config)
        eventsManager.registerEvents('changeCallbackEvent');
        eventsManager.registerEvents('someEvent');
        

        const eventName = 'someEvent';
        const listenersMethodSpy = sinon.spy(emitter, 'listeners');
        eventsManager.emitEvent(eventName, callback);
        expect(listenersMethodSpy.alwaysCalledWithExactly(eventName)).to.equal(true);
    });
    

    it('returns new callback function based on event listeners', () => {
        listeners = [
            { 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: ()  => {
                  console.log('listener1');
              }
            },
          
             { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: ()  => {
                 console.log('yo');
                }
            },
          
            { 
              name: 'my-listener-3',
              event: 'changeCallbackEvent', // event to listen to
              handler: (callback, ...args)  => {
                let newCallback = (...args) => {
                    return 'changed';
                }
                return newCallback(...args);                
            }
          }
        ]

        config = {};
        config.listeners = listeners;
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, config)
        eventsManager.registerEvents('changeCallbackEvent');
        eventsManager.registerEvents('someEvent');
        

        
        callback = () => {
          return 'original function';
        }
        let cb = eventsManager.emitEvent('changeCallbackEvent', callback);
        expect(cb()).to.equal('changed');
    });

    it('calls listeners handlers without "callback" argument', () => {
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        const listenersWithoutCallback = [
            { 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: (callback, ...args) => {
                return callback(...args);
                }
            },
          
            { //listener name
              name: 'my-listener-2',
              event: 'someEvent', 
              handler: ()  => spy2()
            },
        ];
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, { listeners: listenersWithoutCallback })
        eventsManager.registerEvents('someEvent');
        eventsManager.emitEvent('someEvent', callback)();
        
        return expect(spy1.calledOnce) && expect(spy2.calledOnce);
    });

    it('works if handler returns callback call', () => {
        callback = (...args) => {
                       return 'hello' 
                    }

        const listeners = [
            {
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: (callback, ...args) => {
                    return callback(...args);
                }
            },
        ];
        emitter = new EventEmitter();
        eventsManager = eventsManagerProvider(emitter, { listeners });
        eventsManager.registerEvents('someEvent');
        let eventFunc = eventsManager.emitEvent('someEvent', callback);

        expect(eventFunc()).to.equal(callback());
    });


});

/*
example listener:

{ 
                name: 'my-listener-1',
                event: 'someEvent', // event to listen to
                handler: (callback, ...args) => {
                    return callback(...args)  
                }
            },  
*/
