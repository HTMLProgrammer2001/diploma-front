import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {isBoolean, isNil} from 'lodash';
import {ButtonTemplateType} from './button-template-type';
import {EditControlPermissions} from '../../types/edit-control-permissions';

@Component({
  selector: 'cr-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.scss'],
})
export class ButtonControlComponent implements OnInit, OnChanges {
  /**
   * Width of button in px.<br>
   * *Example:* '100px', '200'
   */
  @Input() width: string = '30px';

  /**
   * Height of button in px.<br>
   * *Example:* '100px', '200'
   */
  @Input() height: string = '30px';

  /**
   * Icon for button.<br>
   * **IMPORTANT** can be used only for buttons with *buttonTemplateType* = 'icon-button'
   */
  @Input() icon: string = null;

  /**
   * Array of classes that will be added to button component.<br>
   * *Example:* ['cr-test-class', 'cr-test-class2']
   */
  @Input() classArray: Array<string> = null;

  /**
   * Text translate key for button content.<br>
   * **IMPORTANT** can be used only for buttons without *text* property<br>
   * **IMPORTANT** can be used only for buttons with *buttonTemplateType*
   *    as 'grid-save-command' or 'primary-action-button' or 'secondary-action-button'
   */
  @Input() textTranslateKey: string = null;

  /**
   * Text for button content.<br>
   * **IMPORTANT** can be used only for buttons without *textTranslateKey* property<br>
   */
  @Input() text: string = null;

  /**
   * If this property is true then button will be disabled and *buttonClickEvent* won't dispatch.
   */
  @Input() disabled: boolean;

  /**
   * Text for button tooltip.<br>
   * **IMPORTANT** can be used only for buttons without *tooltipTranslateKey* property
   */
  @Input() tooltipText: string;

  /**
   * Translate key for tooltip. <br>
   */
  @Input() tooltipTranslateKey: string;

  /**
   * Enum of template type. Depending on this property button will change appearance.
   */
  @Input() buttonTemplateType: ButtonTemplateType = null;

  /**
   * Property for permission configuration. Can be boolean or EditControlPermissions object<br>
   * If this property is boolean then all permissions will be equal to this boolean. <br>
   * If this property is object then all properties from this property will be copied. All others will be true.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for button: </b> *button:Component_Name.Data*
   */
  @Input() elementName: string;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for button: </b> *button:Component_Name.Data*
   */
  @Input() type: 'submit' | 'reset' | 'button';

  /**
   * Event that will be dispatched after button click.<br>
   * **IMPORTANT** This event won't be dispatched if *disabled* is true.
   */
  @Output() buttonClickEvent = new EventEmitter<any>();

  public _parsedPermissionSettings: EditControlPermissions = {};
  public dataElementName: string;

  constructor(
    @Optional() @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.permissionSettings) {
      this.initPermissions();
    }
  }

  ngOnInit(): void {
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

  buttonClick(event: any): void {
    this.buttonClickEvent.emit(event);
  }
}
