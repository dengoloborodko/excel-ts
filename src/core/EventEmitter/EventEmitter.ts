import { EventEmitterErrors } from '../Errors';

type EventEmitterListener = {
  listener: Function;
  context?: object;
};

type EventEmitterListeners = {
  [key: string]: EventEmitterListener[];
};

export class EventEmitter extends EventEmitterErrors {
  private readonly listeners: EventEmitterListeners = {};

  public trigger<T extends (...args: any) => any>(
    eventType: string,
    ...args: Parameters<T>
  ): void {
    const listeners = this.listeners[eventType];

    if (!listeners) {
      return console.warn(`No listeners found for event type '${eventType}'`);
    }

    listeners.forEach(({ listener, context }) => {
      if (listener.length !== args.length) {
        this.throwNumberOfArgumentsDoesNotMatchError(eventType);
      }

      listener.apply(context, args);
    });
  }

  public listenTo(
    eventType: string,
    listener: Function,
    context?: object
  ): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }

    for (let listenerObject of this.listeners[eventType]) {
      if (
        listenerObject.listener === listener &&
        listenerObject.context === context
      ) {
        return console.warn(
          `This callback with current context has already been attached 
        for event '${eventType}'`
        );
      }
    }

    this.listeners[eventType].push({ listener, context });
  }

  public stopListening(
    eventType: string,
    listener: Function,
    context?: object
  ): void {
    const listenersOfCurrentEvent = this.listeners[eventType];

    if (!listenersOfCurrentEvent) {
      this.throwNoListenersPresentForEventError(eventType);
    }

    this.listeners[eventType] = listenersOfCurrentEvent.filter(
      listenerObject => {
        const areListenersEqual = listenerObject.listener === listener;
        const areContextsEqual = listenerObject.context === context;

        if (context) {
          return !(areListenersEqual && areContextsEqual);
        } else {
          return !areListenersEqual;
        }
      }
    );
  }
}
