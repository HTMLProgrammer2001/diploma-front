import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationRule} from '../../types/validation/validation-rule';
import {ValidationTypes} from '../../types/validation/validation-types';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-text-area-control',
  templateUrl: './text-area-control.component.html',
  styleUrls: ['./text-area-control.component.scss']
})
export class TextAreaControlComponent implements OnInit, OnChanges {
  /**
   * Current value.
   */
  @Input() dataValue: any;

  /**
   * Event that will be emitted when text change.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Text that will be in label for edit.
   */
  @Input() dataLabel: string;

  /**
   * Translate key for edit label.
   */
  @Input() translateKeys: string;

  /**
   * Validator for this element. <br>
   * **IMPORTANT** It's required if *validationField* is specified.
   */
  @Input() validator: Validator;

  /**
   * If this property is true then edit won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * Validator field for this element. <br>
   * **IMPORTANT** It's required if *validator* is specified.
   */
  @Input() validationField: string;

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for edit: </b> *edit:Component_Name.Data*
   */
  @Input() elementName: string;

  /**
   * Rows number for textarea.
   */
  @Input() rows = 2;

  /**
   * Textarea will display text as normal but without editing.
   */
  @Input() isReadOnly: boolean = false;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public dataElementName: string;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {
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
    if (this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  onInput(event: Event): void {
    if (event.target) {
      const value = (event.target as HTMLInputElement).value;
      this.dataValueChange.emit(value || null);

      if (!!this.validator && this.validationField) {
        this.validator.validateField(this.validationField, value);
      }
    }
  }

  onBlur(event: FocusEvent): void {
    const value = (event.target as HTMLInputElement).value;
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, value);
    }
  }
}
