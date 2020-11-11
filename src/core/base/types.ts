import { Component } from './Component';

export interface Event {
  type: string;
  selector?: string;
  handlerName: string;
}

export interface Events extends Array<Event> {}

export type Children = { [key: string]: Component };

export interface OptionsPassedToComponent {
  className?: string;
  id?: string;
  tagName?: string;
  children?: Children;
  events?: Events;
}

export interface OptionsMountedForComponent {
  className?: string;
  id?: string;
  tagName: string;
}
