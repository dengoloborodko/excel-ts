export abstract class EventEmitterErrors {
  protected throwNumberOfArgumentsDoesNotMatchError(eventType: string): never {
    throw new Error(
      `The number of arguments passed to the trigger method and arguments, 
      required by a listener of the event '${eventType}', aren't equal`
    );
  }

  protected throwNoListenersPresentForEventError(eventType: string): never {
    throw new Error(
      `No listeners present for event '${eventType}'. You need to add listeners 
        first of all`
    );
  }
}
