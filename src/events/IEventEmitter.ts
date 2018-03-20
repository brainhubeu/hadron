export default interface EventEmitter{
    listeners: Function;
    on: Function;
    emit: Function
}