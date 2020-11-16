export abstract class EventEmitterErrors {
  throwNumberOfArgumentsDoesNotMatchError(eventType: string): never {
    throw new Error(
      `The number of arguments passed to the trigger method and arguments, 
      required by a listener of the event '${eventType}', aren't equal`
    );
  }

  throwNoListenersPresentForEventError(eventType: string): never {
    throw new Error(
      `No listeners present for event '${eventType}'. You need to add listeners 
        first of all`
    );
  }
}
