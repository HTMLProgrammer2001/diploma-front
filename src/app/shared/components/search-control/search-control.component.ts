import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cr-control-search',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss']
})
export class SearchControlComponent implements OnInit {
  /**
   * Current search value.
   */
  @Input() dataValue: any;

  /**
   * Emit new search value when it changed.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Placeholder text for search.
   */
  @Input() dataWatermark: string;

  /**
   * Translate key for placeholder text for search.
   */
  @Input() dataWatermarkTranslateKeys: string;

  /**
   * If this property is true then search won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then search won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for search: </b> *search:Component_Name.Data*
   */
  @Input() elementName: string;

  public dataElementName: string;
  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnInit(): void {
    this.initElementName();
  }

  onInput(event: Event): void {
    if (event.target) {
      const value = (event.target as HTMLInputElement).value;
      this.dataValueChange.emit(value);
    }
  }

  onClear(): void {
    this.dataValueChange.emit('');
  }

  initElementName() {
    if(this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }
}
