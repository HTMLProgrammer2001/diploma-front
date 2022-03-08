import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {isBoolean, isNil, union} from 'lodash';
import {ButtonType} from '../../types/button/button-type';
import {ActionButton} from '../../types/button/action-button';
import {IconButton} from '../../types/button/icon-button';
import {ButtonTemplateType} from '../../types/button/button-template-type';
import {EditControlPermissions} from '../../types/edit-control-permissions';

@Component({
  selector: 'cr-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.scss']
})
export class ButtonControlComponent implements OnInit, OnChanges {
  /**
   * Reference to simple action button component
   */
  @ViewChild('kendoButtonTemplate', {static: true}) kendoButtonTemplate: TemplateRef<any>;

  /**
   * Reference to grid add button command component
   */
  @ViewChild('kendoGridAddCommandTemplate', {static: true}) kendoGridAddCommandTemplate: TemplateRef<any>;

  /**
   * Reference to grid edit button command component
   */
  @ViewChild('kendoGridEditCommandTemplate', {static: true}) kendoGridEditCommandTemplate: TemplateRef<any>;

  /**
   * Reference to grid save button command component
   */
  @ViewChild('kendoGridSaveCommandTemplate', {static: true}) kendoGridSaveCommandTemplate: TemplateRef<any>;

  /**
   * Reference to grid cancel button command component
   */
  @ViewChild('kendoGridCancelCommandTemplate', {static: true}) kendoGridCancelCommandTemplate: TemplateRef<any>;

  /**
   * Reference to grid remove button command component
   */
  @ViewChild('kendoGridRemoveCommandTemplate', {static: true}) kendoGridRemoveCommandTemplate: TemplateRef<any>;

  /**
   * Reference to grid icon button component
   */
  @ViewChild('kendoIconButtonTemplate', {static: true}) kendoIconButtonTemplate: TemplateRef<any>;

  /**
   * Width of button in px.<br>
   * *Example:* '100px', '200'
   */
  @Input() width: string = null;

  /**
   * Height of button in px.<br>
   * *Example:* '100px', '200'
   */
  @Input() height: string = null;

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
   * Event that will be dispatched after button click.<br>
   * **IMPORTANT** This event won't be dispatched if *disabled* is true.
   */
  @Output() buttonClickEvent = new EventEmitter<any>();

  public buttonControlSettings: ButtonType = null;
  public _parsedPermissionSettings: EditControlPermissions = {};
  public dataElementName: string;
  templateRef: TemplateRef<any> = null;

  constructor(
    @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initPermissions();
    this.buttonControlSettings = this.getButtonType();

    this.setButtonSettings();

    Object.keys(this.buttonControlSettings).forEach(property => {
      if (changes.hasOwnProperty(property)) {
        if (Array.isArray(changes[property].currentValue)) {
          setTimeout(_ => {
            this.buttonControlSettings[property] = union(this.buttonControlSettings[property], changes[property].currentValue);
          });
        }
        this.buttonControlSettings[property] = changes[property].currentValue;
      }
    });
  }

  ngOnInit(): void {
    switch (this.buttonTemplateType) {
      case 'primary-action-button':
        this.templateRef = this.kendoButtonTemplate;
        break;
      case 'icon-button':
        this.templateRef = this.kendoIconButtonTemplate;
        break;
      case 'grid-cancel-command':
        this.templateRef = this.kendoGridCancelCommandTemplate;
        break;
      case 'grid-save-command':
        this.templateRef = this.kendoGridSaveCommandTemplate;
        break;
      case 'grid-edit-command':
        this.templateRef = this.kendoGridEditCommandTemplate;
        break;
      case 'grid-add-command':
        this.templateRef = this.kendoGridAddCommandTemplate;
        break;
      case 'grid-remove-command':
        this.templateRef = this.kendoGridRemoveCommandTemplate;
        break;
      default:
        this.templateRef = this.kendoButtonTemplate;
    }

    this.initPermissions();
    this.initElementName();
    this.setButtonSettings();
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

  setButtonSettings() {
    this.buttonControlSettings = {
      ...this.buttonControlSettings,
      disabled: this.disabled || !this._parsedPermissionSettings.isAccessEdit,
      classArray: [this._parsedPermissionSettings.isAccessEdit ? '' : 'cr-no-permission']
        .concat(this.buttonControlSettings?.classArray || [])
    };
  }

  buttonClick(event: any): void {
    this.buttonClickEvent.emit(event);
  }

  private getButtonType(): ButtonType {
    switch (this.buttonTemplateType) {
      case 'primary-action-button':
        const primaryActionButton = new ActionButton();
        primaryActionButton.classArray = ['cr-action-button'];
        primaryActionButton.textTranslateKey = this.textTranslateKey;
        return primaryActionButton;
      case 'secondary-action-button':
        const secondaryActionButton = new ActionButton();
        secondaryActionButton.classArray = ['cr-action-button', 'cancel-button'];
        secondaryActionButton.textTranslateKey = this.textTranslateKey;
        return secondaryActionButton;
      case 'underlined-action-button':
        const underlinedActionButton = new ActionButton();
        underlinedActionButton.classArray = ['cr-custom-line-button'];
        underlinedActionButton.textTranslateKey = this.textTranslateKey;
        return underlinedActionButton;
      case 'icon-button':
        const iconButton = new IconButton();
        iconButton.icon = this.icon;
        return iconButton;
      case 'grid-cancel-command':
        const iconCancelButton = new IconButton();
        iconCancelButton.icon = 'icon-close';
        Object.defineProperty(iconCancelButton, 'icon', {
          writable: false
        });
        return iconCancelButton;
      case 'grid-save-command':
        const saveGridButton = new ActionButton();
        saveGridButton.textTranslateKey = this.textTranslateKey;
        return saveGridButton;
      case 'grid-edit-command':
        const iconEditButton = new IconButton();
        iconEditButton.icon = 'icon-edit';
        Object.defineProperty(iconEditButton, 'icon', {
          writable: false
        });
        return iconEditButton;
      case 'grid-add-command':
        const iconAddButton = new IconButton();
        iconAddButton.icon = 'icon-add';
        Object.defineProperty(iconAddButton, 'icon', {
          writable: false
        });
        return iconAddButton;
      case 'grid-remove-command':
        const iconRemoveButton = new IconButton();
        iconRemoveButton.icon = 'icon-delete';
        Object.defineProperty(iconRemoveButton, 'icon', {
          writable: false
        });
        return iconRemoveButton;
      default:
        return new ActionButton();
    }
  }
}
