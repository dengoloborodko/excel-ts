import { EventEmitterErrors } from '../Errors';

type EventEmitterListeners = {
  [key: string]: Function[];
};

export class EventEmitter extends EventEmitterErrors {
  private readonly listeners: EventEmitterListeners;

  constructor() {
    super();

    this.listeners = {};
  }

  public trigger<T extends any[]>(eventType: string, ...args: T): void {
    const listeners = this.listeners[eventType];

    if (!listeners) {
      return console.warn(`No listeners found for event type '${eventType}'`);
    }

    listeners.forEach(listener => {
      if (listener.length !== args.length) {
        this.throwNumberOfArgumentsDoesNotMatchError(eventType);
      }

      listener(...args);
    });
  }

  public listenTo<T extends Function>(eventType: string, listener: T): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }

    const isCallbackExists = this.listeners[eventType].includes(listener);

    if (isCallbackExists) {
      return console.warn(
        `This callback has already been attached for event '${eventType}'`
      );
    }

    this.listeners[eventType].push(listener);
  }

  public stopListening(eventType: string, listenerToRemove: Function): void {
    const listenersOfCurrentEvent = this.listeners[eventType];

    if (!listenersOfCurrentEvent) {
      this.throwNoListenersPresentForEventError(eventType);
    }

    this.listeners[eventType] = listenersOfCurrentEvent.filter(
      listener => listener !== listenerToRemove
    );
  }
}
