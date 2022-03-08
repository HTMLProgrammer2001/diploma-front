import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationRule} from '../../types/validation/validation-rule';
import {ValidationTypes} from '../../types/validation/validation-types';
import {ContextMenuComponent, ContextMenuSelectEvent} from '@progress/kendo-angular-menu';
import {DropDownListComponent} from '@progress/kendo-angular-dropdowns';
import {ContextMenuOperation} from '../../types/context-menu-operation';
import {ContextMenuItem} from '../../types/context-menu-item';
import {isBoolean, isNil} from 'lodash';
import {copyToClipboard} from '../../utils';
import {TranslateService} from '@ngx-translate/core';
import {EditControlPermissions} from '../../types/edit-control-permissions';

@Component({
  selector: 'cr-control-dropdown',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.scss']
})
export class DropdownControlComponent implements OnInit, OnChanges {
  /**
   * Reference to DropDownListComponent.
   */
  @ViewChild('dropdownList') dropdownList: DropDownListComponent;

  /**
   * Reference to ContextMenuComponent.
   */
  @ViewChild('contextmenu') contextMenu: ContextMenuComponent;

  /**
   * Current value. It's value of *dataValueField* in selected item object.
   */
  @Input() dataValue: any;

  /**
   * Translate key for dropdown label.
   */
  @Input() translateKeys: string;

  /**
   * Event that will be emitted when selected item change. Emit *dataValueField* of selected item object.
   */
  @Output() dataValueChange = new EventEmitter<any>();

  /**
   * Field that contains value in selected item object. Usually it's 'ID' field.
   */
  @Input() dataValueField = 'ID';

  /**
   * Field that contains text in selected item object that will be shown. Usually it's 'Name' field.
   */
  @Input() dataDisplayField = 'Name';

  /**
   * Field that contains text in selected item object that will be shown. Usually it's 'Name' field.
   */
  @Input() dataTranslateKeysField = 'translateKeys';

  /**
   * Event that emitted when dropdown open.
   */
  @Output() open = new EventEmitter<any>();

  /**
   * Event that emitted when dropdown blur.
   */
  @Output() blur = new EventEmitter<any>();

  /**
   * External datasource for local paging. <br>
   * **IMPORTANT** This property is more high priority then *getListItemsFunction*
   */
  @Input() dataSource: any;

  /**
   * Text that will be in label for dropdown.
   */
  @Input() dataLabel: string;

  /**
   * If this property is true then dropdown won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then dropdown won't be editable and *dataValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * Default selected object.
   */
  @Input() defaultItem: any;

  /**
   * Validator for this element.
   * **IMPORTANT** It's required if *validationField* is specified.
   */
  @Input() validator: Validator;

  /**
   * Validator field for this element.
   * **IMPORTANT** It's required if *validator* is specified.
   */
  @Input() validationField: string;

  /**
   * Custom validation message without validator. <br>
   * **IMPORTANT** Cannot be used with *validator*.
   */
  @Input() validationMessage: string;

  /**
   * Context menu operations list.
   */
  @Input() contextMenuOperations: Array<ContextMenuOperation>;

  /**
   * Event that will be emitted when item in context menu will be choosen.
   */
  @Output() navigateToEvent = new EventEmitter<any>();

  /**
   *
   * @param obj
   */
  @Input() itemDisabled = (obj: any) => false;

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
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public dataElementName: string;
  public contextMenuItems: Array<ContextMenuItem>;

  constructor(
    protected translate: TranslateService, @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {}

  ngOnInit(): void {
    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.requiredRule = this.validator.getRule(this.validationField, ValidationTypes.required);
    }

    this.initPermissions();
    this.initElementName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // revalidate after changing value
    if (!!changes.value && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.dataValue);
    }
    // initialize context menu
    if (changes.contextMenuOperations && changes.contextMenuOperations.currentValue) {
      this.contextMenuItems = new Array<ContextMenuItem>();
      this.contextMenuOperations.forEach(item => {
        if (item === 'copyToClipboard') {
          this.contextMenuItems.push({
            operation: 'copyToClipboard',
            iconSvg: 'icon-copy-to-clipboard',
            textTranslateKey: 'COMMON.CONTROL_CONTEXT_MENU.COPY_TO_CLIPBOARD'
          });
        }
        if (item === 'navigateTo') {
          this.contextMenuItems.push({
            operation: 'navigateTo',
            iconSvg: 'icon-external-link',
            textTranslateKey: 'COMMON.CONTROL_CONTEXT_MENU.NAVIGATE_TO'
          });
        }
      });
    }

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

  onSelectionChange(event): void {
    if (event && (event[this.dataValueField] !== undefined)) {
      this.dataValueChange.emit(event[this.dataValueField]);
    }

    // validate value
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, event[this.dataValueField]);
    }
  }

  onOpen(): void {
    this.open.emit();
  }

  onBlur(event: FocusEvent): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.dataValue);
    }
    this.blur.emit(event);
  }

  onSelectContextMenu($event: ContextMenuSelectEvent) {
    if (!isNil($event.item)) {
      const selectedItem = $event.item as ContextMenuItem;
      if (selectedItem.operation === 'copyToClipboard') {
        let textToClipboard = '';

        if (this.dropdownList.dataItem) {
          if (this.dataDisplayField && !isNil(this.dropdownList.dataItem[this.dataDisplayField])) {
            textToClipboard = this.dropdownList.dataItem[this.dataDisplayField];
          } else if (this.dataTranslateKeysField && !isNil(this.dropdownList.dataItem[this.dataTranslateKeysField])) {
            textToClipboard = this.translate.instant(this.dropdownList.dataItem[this.dataTranslateKeysField]);
          }
        }

        if (textToClipboard.trim()) {
          copyToClipboard(textToClipboard);
        }
      } else if (selectedItem.operation === 'navigateTo') {
        if (!isNil(this.dropdownList.dataItem)) {
          this.navigateToEvent.emit(this.dropdownList.dataItem);
        }
      }
    }
  }

  onShowContextMenu($event: MouseEvent) {
    this.contextMenu.show({left: $event.pageX, top: $event.pageY});
  }
}
