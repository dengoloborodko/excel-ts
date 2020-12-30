import { Component } from '../Component';
import { RouterInterface, Route } from './types';

export class Router implements RouterInterface {
  private static DEFAULT_PATH = '/';
  private $root: null | HTMLElement = null;
  private activePath: string = Router.DEFAULT_PATH;
  private activeComponents: Component[] = [];

  constructor(
    private routes: Route[] = [],
    private rootSelector: string = 'body',
    private pageNotFound?: Component
  ) {}

  public initialize(): void {
    this.setRootContainerForRouter();
    this.handleHashChange();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  public destroy(): void {
    this.destroyActiveComponents();
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  private setRootContainerForRouter(): void {
    this.$root = document.querySelector(this.rootSelector);

    if (!this.$root) {
      throw new Error(
        `No element found by selector '${this.rootSelector}'. Please, provide 
         valid selector`
      );
    }
  }

  private handleHashChange = (): void => {
    const newPath = Router.getNewPath();

    if (!newPath) {
      Router.setDefaultPath();

      return;
    }

    this.activePath = newPath;
    this.destroyActiveComponents();
    this.updateActiveComponentsAccordingToTheNewPath();
    this.initializeAndRenderActiveComponents();
  };

  private static getNewPath(): string {
    return window.location.hash.substr(1);
  }

  private static setDefaultPath(): void {
    window.location.hash = Router.DEFAULT_PATH;
  }

  private destroyActiveComponents(): void {
    this.activeComponents.forEach(component => component.destroy());
  }

  private updateActiveComponentsAccordingToTheNewPath(): void {
    const { activePath, routes, pageNotFound } = this;
    const pathNestingCombinationsArr = Router.getArrayWithAllCombinationsOfPathNesting(
      activePath
    );

    this.activeComponents = routes
      .filter(({ exact, path }) => {
        if (exact) {
          return activePath === path;
        } else {
          return pathNestingCombinationsArr.includes(path);
        }
      })
      .map(({ component }) => component);

    if (!this.activeComponents.length && pageNotFound) {
      this.activeComponents.push(pageNotFound);
    }
  }

  private initializeAndRenderActiveComponents(): void {
    this.activeComponents.forEach(component => {
      component.initialize();
      this.$root?.append(component.getElementNode());
    });
  }

  private static getArrayWithAllCombinationsOfPathNesting(
    path: string
  ): string[] {
    const pathNestingCombinationsArr: string[] = [Router.DEFAULT_PATH];
    const regExpToSelectLastPartOfThePath = /\/\w*$/;

    while (path) {
      pathNestingCombinationsArr.push(path);
      path = path.replace(regExpToSelectLastPartOfThePath, '');
    }

    return pathNestingCombinationsArr;
  }
}
