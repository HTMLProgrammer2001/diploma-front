import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'getByKey'
})
export class GetByKeyPipe implements PipeTransform {
  transform(value: any, path: string, defaultValue: any = null): unknown {
    return _.get(value, path, defaultValue);
  }
}
