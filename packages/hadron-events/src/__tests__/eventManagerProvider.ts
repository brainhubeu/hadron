import { expect } from 'chai';
import { EventEmitter } from 'events';
import * as sinon from 'sinon';
import { IEventListener } from '../types';
import eventManagerProvider from '../eventManagerProvider';

describe('events registration', () => {
  let emitter: EventEmitter = null;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter = null;
  });

  it('throws an error if eventName is either null or empty string', () => {
    const listeners: IEventListener[] = [
      {
        name: 'my-listener-1',
        event: '', // event to listen to
        handler: (callback, ...args) => {
          return callback(...args);
        },
      },
      {
        name: 'my-listener-2',
        event: 'someEvent',
        handler: (callback, ...args) => {
          return callback(...args);
        },
      },
      {
        name: 'my-listener-3',
        event: 'someEvent', // event to listen to
        handler: (callback, ...args) => {
          return callback(...args);
        },
      },
    ];

    const config = {};
    const eventManager = eventManagerProvider(emitter, config);
    expect(() => eventManager.registerEvents(listeners)).to.throw();
  });
  it('registers listeners', () => {
    const spy1 = () => sinon.spy();
    const spy2 = (callback, ...args) => sinon.spy();

    const listeners = [
      {
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: spy1,
      },
      {
        name: 'my-listener-2',
        event: 'someEvent',
        handler: spy2,
      },
    ];

    const eventManager = eventManagerProvider(emitter, { listeners });
    eventManager.registerEvents(listeners);
    expect(emitter.listeners('someEvent').length).to.equal(2);
    expect(emitter.listeners('someEvent')[0]).to.equal(spy1);
    expect(emitter.listeners('someEvent')[1]).to.equal(spy2);
  });
});

/////////////////////////////////////////////////////

describe('events emitting', () => {
  let emitter: EventEmitter = null;
  let eventManager = null;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter = null;
    eventManager = null;
  });
  it('throws error when eventName argument is either null or empty string', () => {
    const listeners: IEventListener[] = [
      {
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: () => {
          return 'test';
        },
      },
      {
        name: 'my-listener-2',
        event: 'someEvent',
        handler: () => {
          return 'test';
        },
      },
      {
        name: 'my-listener-3',
        event: 'changeCallbackEvent', // event to listen to
        handler: (callback, ...args) => {
          const newCallback = (...args) => {
            return 'changed';
          };
          return newCallback(...args);
        },
      },
    ];

    const config = {};
    eventManager = eventManagerProvider(emitter, config);
    eventManager.registerEvents(listeners);

    const callback = () => 'test';

    expect(() => eventManager.emitEvent('', callback)).throw();
  });

  it('calls emitter.listeners with eventName argument', () => {
    const listeners: IEventListener[] = [];

    const config = {};
    eventManager = eventManagerProvider(emitter, config);
    eventManager.registerEvents(listeners);

    const eventName = 'someEvent';
    const listenersMethodSpy = sinon.spy(emitter, 'listeners');
    const callback = () => 'test';
    eventManager.emitEvent(eventName, callback);
    expect(listenersMethodSpy.alwaysCalledWithExactly(eventName)).to.equal(
      true,
    );
  });

  it('returns new callback function based on event listeners', () => {
    const listeners: IEventListener[] = [
      {
        name: 'my-listener-3',
        event: 'changeCallbackEvent', // event to listen to
        handler: (callback, ...args) => {
          const newCallback = (...args) => {
            return 'changed';
          };
          return newCallback(...args);
        },
      },
    ];

    const config = {};
    eventManager = eventManagerProvider(emitter, config);
    eventManager.registerEvents(listeners);

    const callback = () => 'original function';
    const cb = eventManager.emitEvent('changeCallbackEvent', callback);
    expect(cb()).to.equal('changed');
  });

  it('calls listeners handlers without "callback" argument', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const listenersWithoutCallback: IEventListener[] = [
      {
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: (callback, ...args) => {
          return callback(...args);
        },
      },
      {
        name: 'my-listener-2',
        event: 'someEvent',
        handler: () => spy2(),
      },
    ];
    eventManager = eventManagerProvider(emitter, {
      listeners: listenersWithoutCallback,
    });
    eventManager.registerEvents(listenersWithoutCallback);
    const callback = () => 'test';
    eventManager.emitEvent('someEvent', callback)();

    return expect(spy1.calledOnce) && expect(spy2.calledOnce);
  });

  it('works if handler returns callback call', () => {
    const callback = () => 'test';

    const listeners: IEventListener[] = [
      {
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: (callback, ...args) => {
          return callback(...args);
        },
      },
    ];
    const config = {};
    eventManager = eventManagerProvider(emitter, config);
    eventManager.registerEvents(listeners);
    const eventFunc = eventManager.emitEvent('someEvent', callback);

    expect(eventFunc()).to.equal(callback());
  });

  it('does not throw an error when callback parameter is not passed', () => {
    const listeners: IEventListener[] = [
      {
        name: 'my-listener-1',
        event: 'someEvent', // event to listen to
        handler: () => {
          return null;
        },
      },
    ];
    const config = {};
    eventManager = eventManagerProvider(emitter, config);
    eventManager.registerEvents(listeners);
    expect(eventManager.emitEvent('someEvent')).to.not.throw();
  });
});
