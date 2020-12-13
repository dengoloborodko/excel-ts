type EventEmitterListener = {
  listener: Function;
  context?: object;
};

export type EventEmitterListeners = {
  [key: string]: EventEmitterListener[];
};

export interface EventEmitterInterface {
  trigger<T extends (...args: any) => any>(
    eventType: string,
    ...args: Parameters<T>
  ): void;
  listenTo(eventType: string, listener: Function, context?: object): void;
  stopListening(eventType: string, listener: Function, context?: object): void;
}
