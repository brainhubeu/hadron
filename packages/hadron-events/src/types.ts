export type CallbackEvent = (...args: any[]) => any;
export type EventHandler = (callback: ICallbackEvent, ...args: any[]) => any;

export interface ICallbackEvent {
  callback: CallbackEvent;
}

export interface IEventEmitter {
  listeners: (event: string) => any[];
  on: (eventName: string, handler: EventHandler) => void;
  emit: (eventName: string, event: object) => void;
}

export interface IEventListener {
  name: string;
  event: string;
  handler: EventHandler;
}

// tslint:disable-next-line:no-empty-interface
export interface IHadronEventsConfig {
  events: {
    listeners: IEventListener[];
  };
}
