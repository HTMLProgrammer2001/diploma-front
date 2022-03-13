import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {TimePickerComponent} from '@progress/kendo-angular-dateinputs';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ConfigService} from '../../../global/services/config.service';
import moment from 'moment';
import {transformDateToStringZeroTimeNonTimeZone} from '../../utils';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';
import {DateTimeType} from '../../types/date-time-type';
import {ValidationTypes} from '../../types/validation/validation-types';

@Component({
  selector: 'cr-time-picker-control',
  templateUrl: './time-picker-control.component.html',
  styleUrls: ['./time-picker-control.component.scss']
})
export class TimePickerControlComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Reference to TimePickerComponent.
   */
  @ViewChild('timepicker') timePicker: TimePickerComponent;

  /**
   * Reference to TimePickerComponent as web-template ref.
   */
  @ViewChild('timepicker') timePickerElement: any;

  /**
   * Current selected time.
   */
  @Input() dataValue: any;

  /**
   * Event that will be emitted when selected time changed.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Label text for time-picker.
   */
  @Input() dataLabel: string;

  /**
   * Translate key that will be used in text for time-picker. <br>
   * **IMPORTANT** Can be used only without *dataLabel* property
   */
  @Input() translateKeys: string;

  /**
   * If this property is true then timepicker won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then timepicker won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;
  // @Input() isSimpleView = false;

  /**
   * Validator for this element. <br>
   * **IMPORTANT** It's required if *validationField* is specified.
   */
  @Input() validator: Validator;

  /**
   * Validator field for this element. <br>
   * **IMPORTANT** It's required if *validator* is specified.
   */
  @Input() validationField: string;

  /**
   * Custom pattern for time format in input component.
   */
  @Input() patternTime: DateTimeType = 'time';

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for timepicker: </b> *time:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public currentTimeFormatPattern: string;
  public dataElementName: string;
  public isRequired: boolean;

  constructor(private configService: ConfigService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {
    this.currentTimeFormatPattern = this.configService.getConfig().timeFormat;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dataValue && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }

    if(changes.permissionSettings){
      this.initPermissions();
    }
  }

  ngOnInit(): void {
    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.isRequired = !!this.validator.getRule(this.validationField, ValidationTypes.required);
    }

    this.initPermissions();
    this.initElementName();
  }

  initPermissions() {
    if (isBoolean(this.permissionSettings) || isNil(this.permissionSettings)) {
      this._parsedPermissionSettings = {
        isAccessRead: !!this.permissionSettings,
        isAccessEdit: !!this.permissionSettings
      };
    } else {
      this._parsedPermissionSettings = {
        isAccessRead: this.permissionSettings.isAccessRead ?? true,
        isAccessEdit: this.permissionSettings.isAccessEdit ?? true
      };
    }
  }

  initElementName() {
    if(this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  onValueChange(event: Date): void {
    if (event) {
      const dateStr = this.patternTime ? moment(event).format('HH:mm') : transformDateToStringZeroTimeNonTimeZone(event);
      this.dataValueChange.emit(dateStr);
    }
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, event);
    }
  }

  onBlur(event: any): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.timePicker.value);
    }
  }

  ngAfterViewInit(): void {
    const element = this.timePickerElement?.element.nativeElement.getElementsByClassName('k-select');
    if (!!element && element.length === 1){
      element[0].removeAttribute('title');
    }
  }
}
