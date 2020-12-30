import { Component } from '../Component';

export type Route = {
  component: Component;
  path: string;
  exact?: boolean;
};

export interface RouterInterface {
  initialize(): void;
  destroy(): void;
}
