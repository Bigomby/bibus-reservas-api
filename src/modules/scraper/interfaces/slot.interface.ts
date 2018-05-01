import { Status } from '../enums/status.enum';

export interface Slot {
  readonly status: Status;
  readonly timeFrame?: string;
}
