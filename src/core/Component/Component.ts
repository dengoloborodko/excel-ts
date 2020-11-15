import { DOMListener } from '../DOMListener';
import { EventEmitter } from '../EventEmitter';
import {
  Children,
  OptionsPassedToComponent,
  OptionsMountedForComponent
} from '../types';

const eventEmitter = new EventEmitter();

export abstract class Component extends DOMListener {
  private $el: HTMLElement | null;
  private readonly options: OptionsMountedForComponent;
  protected readonly children: Children;
  protected eventEmitter: EventEmitter;

  protected constructor(options: OptionsPassedToComponent = {}) {
    const {
      tagName = 'div',
      className,
      id,
      children = {},
      events = []
    } = options;

    super(events);

    this.$el = null;
    this.options = { tagName, className, id };
    this.children = children;
    this.eventEmitter = eventEmitter;
    this.render = this.render.bind(this);
  }

  private static createElement(
    tagName: string,
    className?: string,
    id?: string
  ): HTMLElement {
    const $el = document.createElement(tagName);

    if (className) {
      $el.classList.add(className);
    }

    if (id) {
      $el.id = id;
    }

    return $el;
  }

  public getElementNode(): HTMLElement {
    if (!this.$el) {
      this.throwComponentNodeIsNotPresentError();
    }

    return this.$el;
  }

  public getElementHTML(): string {
    if (!this.$el) {
      this.throwComponentHTMLIsNotPresentError();
    }

    return this.$el.outerHTML;
  }

  protected preinitialize(): void {}

  public initialize(): void {
    const { tagName, className, id } = this.options;

    this.preinitialize();
    Object.values(this.children).forEach(child => child.initialize());
    this.$el = Component.createElement(tagName, className, id);
    this.render();
    this.addEvents(this.$el);
  }

  abstract render(): void;

  public destroy(): void {
    if (!this.$el) {
      this.throwComponentIsNotInitializedError();
    }

    Object.values(this.children).forEach(child => child.destroy());
    this.$el.remove();
    this.removeEvents(this.$el);
  }
}
