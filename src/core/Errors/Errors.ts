export abstract class Errors {
  protected throwNoEventsAddedError(): never {
    throw new Error(
      `You didn't add events, so there is no sense of removing them. You can 
        add events by calling 'addEvents' method`
    );
  }

  protected throwErrorIfHandlerCallbackIsNotValid(
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

  protected static throwNoElementFoundBySelectorError(
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

  protected throwComponentNodeIsNotPresentError(): never {
    throw new Error(
      `Component node isn't present yet. You should call the initialize method 
        first of all after component object creation`
    );
  }

  protected throwComponentHTMLIsNotPresentError(): never {
    throw new Error(
      `Component html isn't present yet. You should call the initialize method 
        first of all after component object creation`
    );
  }

  protected throwComponentIsNotInitializedError(): never {
    throw new Error(
      `Component isn't initialized yet. There is no sense in destroying it`
    );
  }
}
