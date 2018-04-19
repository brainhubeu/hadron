export type CallbackEvent = (...args: any[]) => any;
export type EventHandler = (callback: CallbackEvent, ...args: any[]) => any;

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
  events: IEventsConfig;
}

export interface IEventsConfig {
  listeners: IEventListener[];
}
