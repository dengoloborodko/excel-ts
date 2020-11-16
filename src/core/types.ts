import { Component } from './Component';

export interface DomListenerEvent {
  type: string;
  selector?: string;
  handlerName: string;
}

export interface DomListenerEvents extends Array<DomListenerEvent> {}

export type ComponentChildren = { [key: string]: Component };

export interface OptionsPassedToComponent {
  className?: string;
  id?: string;
  tagName?: string;
  children?: ComponentChildren;
  events?: DomListenerEvents;
}

export interface OptionsMountedForComponent {
  className?: string;
  id?: string;
  tagName: string;
}
