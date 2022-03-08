import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LabelControlPermissions} from '../../types/label-control-permissions';
import {isBoolean, isNil} from 'lodash';

@Component({
  selector: 'cr-label-control',
  templateUrl: './label-control.component.html',
  styleUrls: ['./label-control.component.scss'],
})
export class LabelControlComponent implements OnInit, OnChanges {
  /**
   * Current value.
   */
  @Input() dataValue: any;

  /**
   * Text that will be in label.
   */
  @Input() dataLabel: string;

  /**
   * Translate key for edit label.
   */
  @Input() translateKeys: string;

  /**
   * Custom class for label wrapper.
   */
  @Input() customClass: string;

  /**
   * If this field is true then text of label will be styled as a link and click emit *linkClicked* event.
   */
  @Input() containsLink: boolean = false;

  /**
   * Link text.
   */
  @Input() link: string;

  /**
   * Event that will be emitted when click on link occures. <br>
   * **IMPORTANT** Requires *containsLink* is true.
   */
  @Output() linkClicked: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | LabelControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for edit: </b> *edit:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: LabelControlPermissions = {};
  public dataElementName: string;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnInit(): void {
    this.initPermissions();
    this.initElementName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.permissionSettings){
      this.initPermissions();
    }
  }

  initPermissions() {
    if (isBoolean(this.permissionSettings) || isNil(this.permissionSettings)) {
      this._parsedPermissionSettings = {
        isAccessRead: !!this.permissionSettings,
        isAccessLink: !!this.permissionSettings
      };
    } else {
      this._parsedPermissionSettings = {
        isAccessRead: this.permissionSettings.isAccessRead ?? true,
        isAccessLink: this.permissionSettings.isAccessLink ?? true
      };
    }
  }

  initElementName() {
    if(this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  public onLinkClicked(): void {
    this.linkClicked.emit();
  }
}
