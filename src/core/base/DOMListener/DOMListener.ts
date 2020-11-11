import { Event, Events } from '../types';

export abstract class DOMListener {
  private static eventManipulationType = {
    ADD: 'add',
    REMOVE: 'remove'
  };
  private isEventsAdded: boolean;

  protected constructor(private events: Events) {
    this.events = events;
    this.isEventsAdded = false;
  }

  protected addEvents($root: HTMLElement): void {
    this.events.forEach((event: Event) => {
      this.bindEventHandlerCallback(event.handlerName);
      this.manipulateEvent($root, event, DOMListener.eventManipulationType.ADD);
    });

    this.isEventsAdded = true;
  }

  protected removeEvents($root: HTMLElement): void {
    if (!this.isEventsAdded) {
      throw new Error(
        `You didn't add events, so there is no sense of removing them. You can 
        add events by calling 'addEvents' method`
      );
    }

    this.events.forEach((event: Event) =>
      this.manipulateEvent(
        $root,
        event,
        DOMListener.eventManipulationType.REMOVE
      )
    );
  }

  private bindEventHandlerCallback(handlerName: string): void {
    const handlerCallback: any = this[handlerName as keyof this];

    DOMListener.throwErrorIfHandlerCallbackIsNotValid(
      handlerCallback,
      handlerName
    );
    this[handlerName as keyof this] = handlerCallback.bind(this);
  }

  private static throwErrorIfHandlerCallbackIsNotValid(
    handlerCallback: any,
    handlerName: string
  ): never | void {
    if (!handlerCallback) {
      throw new Error(
        `Can't find method in Component by provided handler name '${handlerName}'`
      );
    } else if (typeof handlerCallback !== 'function') {
      throw new Error(
        `Provided handler name '${handlerName}' isn't pointing a function`
      );
    } else if (handlerCallback.length > 1) {
      throw new Error(
        `Provided handler callback with the name '${handlerName}' is defined 
        with ${handlerCallback.length} arguments, but expected only 1 argument 
        - event object`
      );
    }
  }

  private manipulateEvent(
    $root: HTMLElement,
    { type, selector, handlerName }: Event,
    eventManipulationType: string
  ): void {
    const handlerCallback = this.getEventHandlerCallbackByName(handlerName);
    const elementForEventManipulation = DOMListener.getRequiredElementBySelector(
      $root,
      selector
    );

    if (eventManipulationType === DOMListener.eventManipulationType.ADD) {
      elementForEventManipulation.addEventListener(type, handlerCallback);
    } else if (
      eventManipulationType === DOMListener.eventManipulationType.REMOVE
    ) {
      elementForEventManipulation.removeEventListener(type, handlerCallback);
    }
  }

  private getEventHandlerCallbackByName(handlerName: string) {
    return (this[handlerName as keyof this] as unknown) as EventListener;
  }

  private static getRequiredElementBySelector(
    $root: HTMLElement,
    selector?: string
  ): HTMLElement {
    if (!selector) {
      return $root;
    }

    const rootChild: HTMLElement | null = $root.querySelector(selector);

    if (!rootChild) {
      this.throwNoElementFoundBySelectorError($root, selector);
    }

    return rootChild;
  }

  private static throwNoElementFoundBySelectorError(
    $root: HTMLElement,
    selector: string
  ): never {
    const rootTagName = $root.tagName.toLocaleLowerCase();
    const rootClassName = $root.classList ? `.${$root.classList[0]}` : '';

    throw new Error(
      `No element found in ${rootTagName + rootClassName} by provided selector 
      '${selector}'`
    );
  }
}
