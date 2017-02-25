export interface RoomStatusInfo {
  readonly url: string;
  readonly selectors: {
    readonly headerSelector: string;
    readonly contentSelector: string;
  };
}
