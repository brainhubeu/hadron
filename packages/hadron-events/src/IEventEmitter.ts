export default interface IEventEmitter {
  listeners: (event: string) => any[];
  on: (eventName: string, handler: () => any) => void;
  emit: (eventName: string, event: object) => void;
}
