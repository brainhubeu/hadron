import IEventListener from "./IEventListener";
import IEventEmitter from "./IEventEmitter"


/**
 * Function registers list of listeners to given event and fires this event
 * 
 * @param eventName name of the event which will be called
 * @param emitter event emitter
 * @param callback function passed to listeners via .emit() call
 * @param listeners array of listeners 
 * @param args arguments for callback functions
 */
const eventsRegister = (eventName:string, emitter:IEventEmitter,callback:Function, listeners:IEventListener[], ...args:any[]) => {

    if(eventName === "" || eventName === null){
        throw new Error("eventName argument can't be empty");
    }

    if(emitter === null){
        throw new Error("emitter object can't be null");
    }

    if(callback === null){
        throw new Error("callback argument can't be null");
    }

    if(listeners === null){
        throw new Error("listeners argument can't be null");
    }

    if(listeners.length === 0){
        return;
    }
    
    if(args === null){
        throw new Error("args argument can't be null");
    }

    const event = {
        callback: callback
    }

    if(emitter.listeners(eventName).length === 0){ // check if event has any listeners to avoid re-declaration of listener
        listeners.forEach(listener => {
            if(listener.event === eventName){
                emitter.on(eventName, listener.handler(...args));
            }
        })
    }
    emitter.emit(eventName, event);
    
}

export default eventsRegister;
                    