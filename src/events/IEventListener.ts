export default interface IEventListener {
  name: string;
  event: string;
  handler: (...args: any[]) => any;
}
