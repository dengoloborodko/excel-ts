import { ComponentErrors } from '../Errors';
import { DomListenerEvent, DomListenerEvents } from './types';

export abstract class DOMListener extends ComponentErrors {
  private static eventManipulationType = {
    ADD: 'add',
    REMOVE: 'remove'
  };
  private isEventsAdded: boolean = false;

  protected constructor(private events: DomListenerEvents) {
    super();
  }

  protected addEvents($root: HTMLElement): void {
    this.events.forEach((event: DomListenerEvent) => {
      this.bindEventHandlerCallback(event.handlerName);
      this.manipulateEvent($root, event, DOMListener.eventManipulationType.ADD);
    });

    this.isEventsAdded = true;
  }

  protected removeEvents($root: HTMLElement): void {
    if (!this.isEventsAdded) {
      this.throwNoEventsAddedError();
    }

    this.events.forEach((event: DomListenerEvent) =>
      this.manipulateEvent(
        $root,
        event,
        DOMListener.eventManipulationType.REMOVE
      )
    );
  }

  private bindEventHandlerCallback(handlerName: string): void {
    const handlerCallback: any = this[handlerName as keyof this];

    this.throwErrorIfHandlerCallbackIsNotValid(handlerCallback, handlerName);
    this[handlerName as keyof this] = handlerCallback.bind(this);
  }

  private manipulateEvent(
    $root: HTMLElement,
    { type, selector, handlerName }: DomListenerEvent,
    eventManipulationType: string
  ): void {
    const handlerCallback = this.getEventHandlerCallbackByName(handlerName);
    const elementForEventManipulation = DOMListener.getElementForEventManipulation(
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

  private static getElementForEventManipulation(
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
}
