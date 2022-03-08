import {
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
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationTypes} from '../../types/validation/validation-types';
import {ValidationRule} from '../../types/validation/validation-rule';
import {NumericTextBoxComponent} from '@progress/kendo-angular-inputs';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';
import {NumberFormatOptions} from '@progress/kendo-angular-intl';

/**
 * Numeric Control - used for editing numeric dsta
 */
@Component({
  selector: 'cr-numeric-control',
  templateUrl: './numeric-control.component.html',
  styleUrls: ['./numeric-control.component.scss']
})
export class NumericControlComponent implements OnInit, OnChanges {
  /**
   * Reference to NumericTextBoxComponent component.
   */
  @ViewChild('numericComponent') refNumeric: NumericTextBoxComponent;

  /**
   * Current value.
   */
  @Input() dataValue: any;

  /**
   * Event that will be emitted when numeric value change.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Text that will be in label for edit.
   */
  @Input() dataLabel: string;

  /**
   * Translate key for edit label. <br>
   * **IMPORTANT** Cannot be used with *dataLabel* property.
   */
  @Input() translateKeys: string;

  /**
   * Custom class for edit wrapper.
   */
  @Input() customClass: string;

  /**
   * If this property is true then edit won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then edit won't be editable and *dataValueChange* won't trigger. <br>
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
   * Restriction on min numeric value.
   */
  @Input() min: number;

  /**
   * Restriction on max numeric value.
   */
  @Input() max: number;

  /**
   * If this property is true then value will be autocorrect to fit in range. <br>
   * <i>For example if min is 5 and value is 3 then numeric will autocorrect it to 5.</i>
   */
  @Input() autoCorrectMinMax: boolean;

  /**
   * Format of displayed number in numeric. <br>
   * **IMPORTANT** It does not impose restrictions on data entry, but only on display.
   */
  @Input() format: string | NumberFormatOptions | null | undefined;

  /**
   * Number of decimals that user can type into numeric.
   */
  @Input() decimals: number;

  /**
   * Event that will be emitted when focus on numeric component lost.
   */
  @Output() blur = new EventEmitter<any>();

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for numeric: </b> *numeric:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public dataElementName: string;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dataValue && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }
    if (!!changes.decimals && !changes.decimals.firstChange) {
      setTimeout(() => this.onInput(this.refNumeric.value));
    }

    if(changes.permissionSettings){
      this.initPermissions();
    }
  }

  ngOnInit(): void {
    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.requiredRule = this.validator.getRule(this.validationField, ValidationTypes.required);
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

  onBlur(event: any): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.dataValue);
    }
    this.blur.emit(event);
  }

  onInput(value: any): void {
    // if (value !== undefined && value !== null) {
    this.dataValueChange.emit(value);
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, value);
    }
    // }
  }
}
