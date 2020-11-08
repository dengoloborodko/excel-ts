import { Component } from './Component';

export type Children = { [key: string]: Component };

export interface OptionsPassedToComponent {
  className?: string;
  id?: string;
  tagName?: string;
  children?: Children;
}

export interface OptionsMountedForComponent {
  className?: string;
  id?: string;
  tagName: string;
}
