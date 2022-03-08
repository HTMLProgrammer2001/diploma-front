import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationRule} from '../../types/validation/validation-rule';
import {ValidationTypes} from '../../types/validation/validation-types';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-edit-password-control',
  templateUrl: './edit-password-control.component.html',
  styleUrls: ['./edit-password-control.component.scss']
})
export class EditPasswordControlComponent implements OnInit, OnChanges {
  /**
   * Current value.
   */
  @Input() dataValue: string;

  /**
   * Event that will be emitted when password text change.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Restriction for password.
   */
  @Input() availableSymbols: 'numbers' | 'numbersAndLetters' | 'All';

  /**
   * Text that will be in label for password.
   */
  @Input() dataLabel: string;

  /**
   * Translate key for text that will be in label for password. <br>
   * **IMPORTANT** Cannot use with *dataLabel*.
   */
  @Input() translateKeys: string;

  /**
   * Custom class that will be added to password wrapper.
   */
  @Input() customClass: string;

  /**
   * If this property is true then password won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * If this property is true then password won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * Validator for this element.
   * **IMPORTANT** It's required if *validationField* is specified.
   */
  @Input() validator: Validator;

  /**
   * Validator field for this element. <br>
   * **IMPORTANT** It's required if *validator* is specified.
   */
  @Input() validationField: string;
  @Input() autocomplete: string;

  /**
   * If this field is true then password will be shown for user.
   */
  @Input() showPassword = false;

  /**
   * Event that will be emitted when show password toggle.
   */
  @Output() showPasswordToggle = new EventEmitter<boolean>();

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for password: </b> *password:Component_Name.Data*
   */
  @Input() elementName: string;

  /**
   * If this field is true then password button will be show for user.
   */
  @Input() showPasswordButton = true;

  /**
   * If this field is true then it will create a feeling that password exists.
   */
  @Input() showPasswordPlaceholder = false;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public dataElementName: string;
  public showPlaceholder = false;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  public ngOnInit(): void {
    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.requiredRule = this.validator.getRule(this.validationField, ValidationTypes.required);
    }

    this.initPermissions();
    this.initElementName();

    if(this.showPasswordPlaceholder) {
      this.showPlaceholder = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dataValue && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }

    if(changes.permissionSettings){
      this.initPermissions();
    }
  }

  public switchInput(event: Event): void {
    this.showPassword = !this.showPassword;
    this.showPasswordToggle.emit(this.showPassword);
  }

  onFocus(event: FocusEvent) {
    if(this.showPasswordPlaceholder) {
      this.showPlaceholder = false;
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

    if(value.length === 0 && this.showPasswordPlaceholder) {
      this.showPlaceholder = true;
    }
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
}
