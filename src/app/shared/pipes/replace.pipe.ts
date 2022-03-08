import {Pipe, PipeTransform} from '@angular/core';
import {interpolateString} from '../utils';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  transform(textTemplate: string, value: any): string {
    return interpolateString(textTemplate, value);
  }
}
