export type DomListenerEvent = {
  type: string;
  selector?: string;
  handlerName: string;
};

export type DomListenerEvents = DomListenerEvent[];
