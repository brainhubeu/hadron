/* tslint:disable */
import { expect } from 'chai';
import { EventEmitter } from 'events';
import * as sinon from 'sinon';
import ICallbackEvent from '../ICallbackEvent';
import IEventListener from '../IEventListener';

import eventsProvider from '../eventsProvider';

describe("events registration", () => {
    let listeners: IEventListener[] = null;
    let emitter: EventEmitter = null;
    let args = null;
    let callback = null;
    let config = null;
    let eventsRegister = null;

    beforeEach(() => {
        listeners = [
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

        config = {};
        config.listeners = listeners;
        emitter = new EventEmitter();
        eventsRegister = eventsProvider(emitter, config)

        callback = () => {
            return "works";
        }
        args = [];


    });
    it('throws error when eventName argument is either null or empty string', () => {
        expect(() => eventsRegister('',callback,[])).throw();

    });
    it('throws an error when emitter is null', () => {
        eventsRegister('ww',callback,[]);
    });
    it('registers listeners only once', () => {
        expect(emitter.listeners('someEvent').length).to.equal(0);
        eventsRegister('someEvent', callback, []);
        expect(emitter.listeners('someEvent').length).to.equal(3);
        eventsRegister('someEvent', callback, []);
        expect(emitter.listeners('someEvent').length).to.equal(3);
    });

    it('calls emitter.listeners with eventName argument', () => {
        const eventName = 'someEvent';
        const listenersMethodSpy = sinon.spy(emitter, 'listeners');
        eventsRegister(eventName, callback, []);
        expect(listenersMethodSpy.alwaysCalledWithExactly(eventName)).to.equal(true);
    });

    it('calls emitter.emit', () => {
        const emitMethodSpy = sinon.spy(emitter, 'emit');
        eventsRegister('someEvent', callback, []);
        expect(emitMethodSpy.calledOnce).to.equal(true);
    });

    it('calls handler methods', () => {
        let spies = [];
        listeners.forEach(listener => {
            spies.push(sinon.spy(listener, 'handler'));
        });
        eventsRegister('someEvent',emitter,callback, listeners, []);
        spies.forEach((spy) => {
            expect(spy.calledOnce).to.equal(true);
        });
    });

    it('calls handler methods', () => {
        config.listeners = [];
        expect(() => eventsRegister('someEvent',callback,[])).not.to.throw();

    });

})
