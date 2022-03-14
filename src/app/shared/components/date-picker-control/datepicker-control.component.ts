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
  ViewChild,
} from '@angular/core';
import {DatePickerComponent, DateTimePickerComponent} from '@progress/kendo-angular-dateinputs';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ConfigService} from '../../../global/services/config/config.service';
import {ValidationTypes} from '../../types/validation/validation-types';
import {DateTimeType} from '../../types/date-time-type';
import {transformDateToStringByType} from '../../utils';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-control-datepicker',
  templateUrl: './datepicker-control.component.html',
  styleUrls: ['./datepicker-control.component.scss'],
  providers: [DatePickerComponent, DateTimePickerComponent],
})
export class DatepickerControlComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Reference to DatePickerComponent.
   */
  @ViewChild('datepicker') datepicker: DatePickerComponent;

  /**
   * Reference to DatePickerComponent as template ref.
   */
  @ViewChild('datepicker') datepickerElement: any;

  /**
   * Current selected date.
   */
  @Input() dataValue: any;

  /**
   * Event that will be emitted when selected date changed.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Label text for date-picker.
   */
  @Input() dataLabel: string;

  /**
   * Translate key that will be used in text for date-picker. <br>
   * **IMPORTANT** Can be used only without *dataLabel* property
   */
  @Input() translateKeys: string;

  /**
   * If this property is true then datepicker won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then datepicker won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

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
   * Custom validation message without validator. <br>
   * **IMPORTANT** Cannot be used with *validator*.
   */
  @Input() validationMessage: string;

  /**
   * Custom pattern for date format in input component.
   */
  @Input() patternDateInput: DateTimeType = null;

  /**
   * Custom pattern for emitted date format.
   */
  @Input() patternDateOutput: DateTimeType = null;

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for datepicker: </b> *date:Component_Name.Data*
   */
  @Input() elementName: string;

  /**
   * Property that determines whether the user can select only the month
   */
  @Input() selectOnlyMonth: boolean;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public currentDateFormatPattern: string;
  public isRequired: boolean;
  public dataElementName: string;

  constructor(private configService: ConfigService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean) {
    this.currentDateFormatPattern = this.configService.getConfig().dateFormat;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dataValue && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }

    if (changes.permissionSettings) {
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
    if (this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  onValueChange(event: Date): void {
    if(this.selectOnlyMonth && event) {
      event.setDate(1);
    }

    const dateStr = event ? transformDateToStringByType(event, this.patternDateOutput) : null;

    // emit changes only when year has correct format (4 characters)
    if (!isNil(dateStr) && String(event.getFullYear()).length === 4) {
      this.dataValueChange.emit(dateStr);
    }
    else {
      this.dataValueChange.emit(null);
    }

    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, event);
    }
  }

  onBlur(event: any): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.datepicker.value);
    }
  }

  ngAfterViewInit(): void {
    const element = this.datepickerElement?.element.nativeElement.getElementsByClassName('k-select');
    if (!!element && element.length === 1) {
      element[0].removeAttribute('title');
    }
  }
}
