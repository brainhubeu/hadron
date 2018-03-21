export interface ICallbackEvent {
  callback: (...args: any[]) => any,
}

export interface IEventEmitter {
  listeners: (event: string) => any[];
  on: (eventName: string, handler: () => any) => void;
  emit: (eventName: string, event: object) => void;
}


export interface IEventListener {
  name: string;
  event: string;
  handler: (...args: any[]) => any;
}
