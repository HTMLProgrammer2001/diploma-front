import {Component, Input} from '@angular/core';
import {IconSet} from '../../types/icon';

@Component({
  selector: 'cr-svg-icon-control',
  template: `
    <svg
      [class.cr-no-svg-icon]="!iconName"
      style="{{height ? 'height:' + height + ';' : ''}}{{width ? 'width:' + width + ';' : ''}}{{fill ? 'fill:' + fill + ';' : ''}}">
      <use *ngIf="iconName" attr.xlink:href="./assets/images/{{iconSet}}.svg#{{iconName}}"></use>
    </svg>`,
  styleUrls: ['./svg-icon-control.component.scss']
})
export class SvgIconControlComponent {
  /**
   * Name of requested icon set.
   */
  @Input() iconSet: IconSet = 'icon-set';

  /**
   * Name of requested icon.
   */
  @Input() iconName: string;

  /**
   * Icon height in pixels.
   */
  @Input() height: string;

  /**
   * Icon width in pixels.
   */
  @Input() width: string;

  /**
   * Fill color.
   */
  @Input() fill: string;
}
