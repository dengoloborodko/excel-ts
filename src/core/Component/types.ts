import { Component } from './Component';
import { DomListenerEvents } from '../DOMListener/types';

export type ComponentChildren = { [key: string]: Component };

export type OptionsPassedToComponent = {
  className?: string;
  id?: string;
  tagName?: string;
  children?: ComponentChildren;
  events?: DomListenerEvents;
};

export type OptionsMountedForComponent = {
  className?: string;
  id?: string;
  tagName: string;
};

export type Props = { [key: string]: any };

export interface ComponentInterface {
  getElementNode(): HTMLElement;
  getElementHTML(): string;
  setElementHTML(html: string): void;
  initialize(): void;
  render(): void;
  destroy(): void;
}
