## Installation

```bash
npm install @brainhubeu/hadron-events --save
```

[More info about installation](/core/#installation)

## Overview

Event Manager is a tool which allows manipulating Hadron's default behavior without the need to change the code base. It can be achieved via custom listeners defined by the developer. There are a bunch of extension points spread all over the hadron framework where listeners can be hooked up.

## Initializing

Pass package as an argument for hadron bootstrapping function:

```javascript
// ... importing and initializing other components

hadron(expressApp, [require('@brainhubeu/hadron-events')], config).then(() => {
  console.log('Hadron with eventManager initialized');
});
```

After initialization you can retrieve event manager from DI container - it is registered under the key `eventManager`.

## Event Manager methods

### Registering listeners for events

```javascript
eventManager.registerEvents(listeners);
```

* `listeners` - an array of objects which have to follow convention showed below:

```javascript
{
  name: 'string',  // listener name
  event: 'string', // event to register to
  handler: 'function' // function to handle the event
}
```

### Emitting events

```javascript
eventManager.emitEvent(eventName);
```

Calls all listeners handlers registered for the event with event name passed to it.

* `eventName` - name of the event which will be fired

## Listeners

You can create your listeners in the main config file.

As a first argument listener's handler method will receive a callback function originally called by hadron, so you can change/override it however you want and then return a call of newly created function or a call of existing callback if you don't want to change it.

To be able to receive callback mentioned above, the first argument should be named exactly `callback`, otherwise, you will not receive the callback.

You can also, define your listener's handler without `callback` argument or even without any arguments, which is also a valid way to create listeners, you just won't be able to access the callback.

The second argument of listeners handler method is `...args`, which can be used as arguments for the callback function.

An example of a listener:

```javascript
{
  name: 'Listener',
  event: 'createRoutesEvent',
  handler: (callback, ...args) => {
    const myCustomCallback = () => {
      console.log("Hey! I've changed the original hadron function!");
      return callback(...args);
    }
    return myCustomCallback();
  }
}
```

## Extension points in hadron

As said before, there are a couple of extension points in the hadron framework to which you can hook up your listeners.
The extension points are:

---

`HANDLE_REQUEST_CALLBACK_EVENT`

Event fires, before route callback function is called, passes route callback to the listener.

---

`HANDLE_INITIALIZE_APPLICATION_EVENT`

Event fires when hadron packages are loaded successfully, it doesn't pass a callback to the listener.

---

`HANDLE_TERMINATE_APPLICATION_EVENT`

Event fires when the application is terminated with <kbd>CTRL</kbd> + <kbd>C</kbd>, passes default hadron callback to the listener.
