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
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationRule} from '../../types/validation/validation-rule';
import {ValidationTypes} from '../../types/validation/validation-types';
import {Validator} from '../../types/validation/validator';
import {isBoolean, isEmpty, isNil} from 'lodash';
import {FileRestrictions} from '@progress/kendo-angular-upload';
import {EditControlPermissions} from '../../types/edit-control-permissions';

@Component({
  selector: 'cr-file-control',
  templateUrl: './file-control.component.html',
  styleUrls: ['./file-control.component.scss']
})
export class FileControlComponent implements OnInit, OnChanges {
  /**
   * Reference on fileSelect component.
   */
  @ViewChild('fileSelect') fileSelect: any;

  /**
   * Current selected files.
   */
  @Input() dataValue: any;

  /**
   * Event that will be emitted when password text change.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Custom class that will be added to file select wrapper.
   */
  @Input() customClass: string;

  /**
   * If this property is true then file select won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * Text that will be in label for password.
   */
  @Input() dataLabel: string;

  /**
   * Translate key for text that will be in label for password. <br>
   * **IMPORTANT** Cannot use with *dataLabel*.
   */
  @Input() translateKeys: string;

  // dataDropzoneMessage - translation for dropzone message
  @Input() dataDropzoneMessage: string = 'COMMON.DROPZONE';


  /**
   * If this field is true then file select can contain multiple selected files.
   */
  @Input() multiple = false;

  /**
   * File restriction for component. <br>
   * It's contains allowed extensions for files
   */
  @Input() allowedExtensions: Array<string>;

  /**
   * File restriction for component. <br>
   * It's contains min size in bytes
   */
  @Input() minFileSize: number;

  /**
   * File restriction for component. <br>
   * It's contains max size in bytes
   */
  @Input() maxFileSize: number;

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
   * <b>Template for file: </b> *file:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public fileRestrictions: FileRestrictions = {};
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public selectedFiles: Array<File>;
  public dataElementName: string;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.dataValue && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }

    if(changes.dataValue){
      if(Array.isArray(this.dataValue)){
        this.selectedFiles = [...this.dataValue];
      }
      else{
        this.selectedFiles = isNil(this.dataValue) ? [] : [this.dataValue];
      }
    }

    if(changes.permissionSettings){
      this.initPermissions();
    }
  }

  ngOnInit(): void {
    //region File restrictions
    //Check if file restrictions are not empty and add them
    if (!isEmpty(this.allowedExtensions)) {
      this.fileRestrictions.allowedExtensions = this.allowedExtensions;
    }

    if (!isNil(this.minFileSize)) {
      this.fileRestrictions.minFileSize = this.minFileSize;
    }

    if (!isNil(this.maxFileSize)) {
      this.fileRestrictions.maxFileSize = this.maxFileSize;
    }
    //endregion File restrictions

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

  onValueChange(files: Array<File>): void {
    if (!isNil(files) && !isEmpty(files)) {
      const value = this.multiple ? files : files[0];
      this.dataValueChange.emit(value || null);
    }
    else{
      this.dataValueChange.emit(null);
    }
    setTimeout(() => {
      const fileInput = this.fileSelect.wrapper;
        const inputFiles = fileInput.querySelectorAll('.k-file-name');
        inputFiles.forEach((item) => item.removeAttribute('title'));
        const closeButtons = fileInput.querySelectorAll('.k-delete');
        closeButtons.forEach((item) => item.removeAttribute('title'));
    });
  }
}
