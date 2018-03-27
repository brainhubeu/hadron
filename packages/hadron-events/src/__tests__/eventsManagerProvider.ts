import { expect } from 'chai';
import { EventEmitter } from 'events';
import * as sinon from 'sinon';
import { ICallbackEvent, IEventEmitter, IEventListener } from '../types';
import eventsManagerProvider from '../eventsMaganerProvider';
import { hasFunctionArgument } from '../helpers/functionHelper';

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
        event: 'someEvent', // event to listen to
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
    ]


    const config = { listeners };
    emitter = new EventEmitter();
    const eventsManager = eventsManagerProvider(emitter, config)
    expect(() => eventsManager.registerEvents('')).to.throw();
  });
  it('registers listeners functions from config', () => {
    emitter = new EventEmitter();
    const spy1 = () => sinon.spy();
    const spy2 = (callback, ...args) => sinon.spy();
    const tab = [spy1, spy2];

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
    ]

    const eventsManager = eventsManagerProvider(emitter, { listeners });
    eventsManager.registerEvents('someEvent');
    expect(emitter.listeners('someEvent').length).to.equal(2);
    expect(emitter.listeners('someEvent')[0]).to.equal(spy1);
    expect(emitter.listeners('someEvent')[1]).to.equal(spy2);
  });
});


/////////////////////////////////////////////////////

describe('events emitting', () => {
  let emitter: EventEmitter = null;
  let eventsManager = null;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  afterEach(() => {
    emitter = null;
    eventsManager = null;
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
          }
          return newCallback(...args);
        },
      },
    ]

    const config = { listeners };
    emitter = new EventEmitter();
    eventsManager = eventsManagerProvider(emitter, config)
    eventsManager.registerEvents('changeCallbackEvent');
    eventsManager.registerEvents('someEvent');

    const callback = () => 'test';

    expect(() => eventsManager.emitEvent('', callback)).throw();
  });

  it('calls emitter.listeners with eventName argument', () => {

    const listeners: IEventListener[] = [];

    const config = { listeners };
    emitter = new EventEmitter();
    eventsManager = eventsManagerProvider(emitter, config)
    eventsManager.registerEvents('someEvent');

    const eventName = 'someEvent';
    const listenersMethodSpy = sinon.spy(emitter, 'listeners');
    const callback = () => 'test';
    eventsManager.emitEvent(eventName, callback);
    expect(listenersMethodSpy.alwaysCalledWithExactly(eventName)).to.equal(true);
  });

  it('returns new callback function based on event listeners', () => {
    const listeners: IEventListener[] = [
      {
        name: 'my-listener-3',
        event: 'changeCallbackEvent', // event to listen to
        handler: (callback, ...args) => {
          const newCallback = (...args) => {
            return 'changed';
          }
          return newCallback(...args);
        },
      },
    ]

    const config = { listeners };
    emitter = new EventEmitter();
    eventsManager = eventsManagerProvider(emitter, config)
    eventsManager.registerEvents('changeCallbackEvent');
    eventsManager.registerEvents('someEvent');

    const callback = () => 'original function';
    const cb = eventsManager.emitEvent('changeCallbackEvent', callback);
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
    emitter = new EventEmitter();
    eventsManager = eventsManagerProvider(emitter, { listeners: listenersWithoutCallback })
    eventsManager.registerEvents('someEvent');
    const callback = () => 'test';
    eventsManager.emitEvent('someEvent', callback)();

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
    emitter = new EventEmitter();
    eventsManager = eventsManagerProvider(emitter, { listeners });
    eventsManager.registerEvents('someEvent');
    const eventFunc = eventsManager.emitEvent('someEvent', callback);

    expect(eventFunc()).to.equal(callback());
  });

});
