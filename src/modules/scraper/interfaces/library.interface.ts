export interface Library {
  readonly url: string;
  readonly selectors: {
    readonly headerSelector: string;
    readonly contentSelector: string;
  };
}
