import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-checkbox-control',
  templateUrl: './checkbox-control.component.html',
  styleUrls: ['./checkbox-control.component.scss']
})
export class CheckboxControlComponent implements OnInit, OnChanges {
  /**
   * Current checkbox state.
   */
  @Input() dataValue: boolean;

  /**
   * Event that will be emitted when checkbox state changed.
   */
  @Output() dataValueChange = new EventEmitter<boolean>();

  /**
   * Label text for checkbox.
   */
  @Input() dataLabel: string;

  /**
   * Translate key that will be used in text for checkbox. <br>
   * **IMPORTANT** Can be used only without *dataLabel* property
   */
  @Input() translateKeys: string;

  /**
   * If this property is true then checkbox won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then checkbox won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * If this property is false then checkbox appearance change to invalid.
   */
  @Input() isValid = false;

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for checkbox: </b> *checkbox:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public dataElementName: string;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnInit(): void {
    this.initPermissions();
    this.initElementName();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.permissionSettings){
      this.initPermissions();
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

  onValueChange($event: Event): void {
    if (!this.isReadOnly) {
      this.dataValueChange.emit(this.dataValue);
    }
  }
  onClick($event: MouseEvent): boolean {
    if (this.isReadOnly) {
      return false;
    }
  }
}
