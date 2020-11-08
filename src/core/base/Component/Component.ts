import { DOMListener } from '../DOMListener';
import {
  Children,
  OptionsPassedToComponent,
  OptionsMountedForComponent
} from './types';

export abstract class Component extends DOMListener {
  private $el: HTMLElement | null;
  private readonly options: OptionsMountedForComponent;
  protected children: Children;

  protected constructor(options: OptionsPassedToComponent = {}) {
    super();

    const { tagName = 'div', className, id, children = {} } = options;

    this.$el = null;
    this.options = { tagName, className, id };
    this.children = children;
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
      throw new Error(
        `Component node isn't present yet. You should call the initialize method 
        first of all after component object creation`
      );
    }

    return this.$el;
  }

  public getElementHTML(): string {
    if (!this.$el) {
      throw new Error(
        `Component html isn't present yet. You should call the initialize method 
        first of all after component object creation`
      );
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
    // add listeners
  }

  abstract render(): void;

  public destroy(): void {
    if (!this.$el) {
      throw new Error(
        `Component isn't initialized yet. There is no sense in destroying it`
      );
    }

    Object.values(this.children).forEach(child => child.destroy());
    this.$el.remove();
    // remove listeners
  }
}
