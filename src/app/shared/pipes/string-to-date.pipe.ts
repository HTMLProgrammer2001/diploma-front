import {Pipe, PipeTransform} from '@angular/core';
import {DateTimeType} from '../types/date-time-type';
import {parseTimezone} from '../utils';

@Pipe({
  name: 'stringToDate'
})
export class StringToDatePipe implements PipeTransform {
  transform(value: any, preset: DateTimeType = null): Date {
    let result: Date = null;

    if (value) {
      result = new Date(value);
      switch (preset) {
        case 'no-time':
          result = new Date(result.getFullYear(), result.getMonth(), result.getDate());
          break;
        case 'min-time':
          result = new Date(result.getFullYear(), result.getMonth(), result.getDate(), 0, 0, 0, 0);
          break;
        case 'max-time':
          result = new Date(result.getFullYear(), result.getMonth(), result.getDate(), 23, 59, 59, 999);
          break;
        case 'time':
          value = value.slice(value.search('T') + 1, value.length);
          const [hour, minute] = value.split(':').map(Number);
          result = new Date(2020, 1, 1, hour, minute);
          break;
        case 'ignore-time-zone':
          result = new Date(parseTimezone(value));
          break;
        case 'local-time-zone':
          result = new Date(parseTimezone(value));
          break;
      }
    }

    return result;
  }
}
