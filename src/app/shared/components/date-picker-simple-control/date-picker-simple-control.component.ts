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
import {DatePickerComponent} from '@progress/kendo-angular-dateinputs';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ConfigService} from '../../../global/services/config.service';
import {transformDateToStringZeroTimeNonTimeZone} from '../../utils';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-date-picker-simple-control',
  templateUrl: './date-picker-simple-control.component.html',
  styleUrls: ['./date-picker-simple-control.component.scss']
})
export class DatePickerSimpleControlComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Reference to DatePickerComponent.
   */
  @ViewChild('datepicker') datepicker: DatePickerComponent;

  /**
   * Reference to DatePickerComponent as template ref.
   */
  @ViewChild('datepicker') datepickerElement;

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

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public currentDateFormatPattern: string;
  public dataElementName: string;

  constructor(private configService: ConfigService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean) {
    this.currentDateFormatPattern = this.configService.getConfig().dateFormat;
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
      const dateStr = transformDateToStringZeroTimeNonTimeZone(event);
      this.dataValueChange.emit(dateStr);
    }else{
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
