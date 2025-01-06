# [EventEmitter](https://nodejs.org/docs/latest-v22.x/api/events.html)

- The EventEmitter is typically used for handling **asynchronous** events.
- It's ideal for scenarios where the **exact timing** of the event is **unpredictable**.
- It also allows you to perform **multiple tasks** when an event is triggered.

## [emitter.on(eventName, listener)](https://nodejs.org/docs/latest-v22.x/api/events.html#emitteroneventname-listener)

Use `.on()` to **listen** for a specific event.

Inside the listener, you define **what** should happen when the event is emitted.

```
myEmitter.on("eventName", (data) => {
  // Code to handle the event
});
```

## [emitter.emit(eventName[, ...args])](https://nodejs.org/docs/latest-v22.x/api/events.html#emitteremiteventname-args)

Use `.emit()` to **trigger** an event and optionally pass data to its listeners.

```
myEmitter.emit("eventName", eventData);
```

## Summary

- `.on()` Sets up a **listener** for an event.
- `.emit()` **Triggers** the event.
