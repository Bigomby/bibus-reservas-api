export enum Status {
  Available = 'available',
  Reserved = 'reserved',
  Closed = 'closed',
  Unknown = 'unknown',
}

export interface Slot {
  readonly status: Status;
  readonly timeFrame?: string;
}
