type EventEmitterListeners = {
  [key: string]: Function[];
};

export class EventEmitter {
  private readonly listeners: EventEmitterListeners;

  constructor() {
    this.listeners = {};
  }

  public trigger<T extends any[]>(eventType: string, ...args: T): void {
    const listeners = this.listeners[eventType];

    if (!listeners) {
      return console.warn(`No listeners found for event type '${eventType}'`);
    }

    listeners.forEach(listener => {
      if (listener.length !== args.length) {
        throw new Error(
          `The number of arguments passed to the trigger method and arguments, 
          required by a listener of the event '${eventType}', aren't equal`
        );
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
      throw new Error(
        `No listeners present for event '${eventType}'. You need to add listeners 
        first of all`
      );
    }

    this.listeners[eventType] = listenersOfCurrentEvent.filter(
      listener => listener !== listenerToRemove
    );
  }
}
