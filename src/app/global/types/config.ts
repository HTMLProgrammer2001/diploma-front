export class Config {
  apiUrl: string;
  pagingGridSmallSize: number;
  pagingGridSmallPage: number;
  pagingGridMediumSize: number;
  pagingGridMediumPage: number;
  pagingGridBigSize: number;
  pagingGridBigPage: number;
  pagingDropdownSize: number;
  pagingDropdownPage: number;
  storeBookmarkExpirePeriodHours: number;
  storeBookmarkBufferSize: number;
  checkLogoffIntervalSeconds: number;
  inactivityPeriodMinutes: number;
  answerPeriodSeconds: number;
  dateFormat: string;
  dateTimeFormat: string;
  timeFormat: string;

  constructor(data: Partial<Config>) {
    Object.assign(this, data);
  }
}
