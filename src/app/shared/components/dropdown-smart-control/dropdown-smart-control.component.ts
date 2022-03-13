import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, debounceTime, filter, tap} from 'rxjs/operators';
import {groupBy} from '@progress/kendo-data-query';
import {DropDownListComponent, PreventableEvent} from '@progress/kendo-angular-dropdowns';
import {IPaginatorBase} from '../../types/paginator-base';
import {BookmarkService} from '../../../global/services/bookmark.service';
import {ConfigService} from '../../../global/services/config.service';
import {IPaginator} from '../../types/paginator';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {copyToClipboard, isEmptyObject} from '../../utils';
import {ValidationTypes} from '../../types/validation/validation-types';
import {ValidationRule} from '../../types/validation/validation-rule';
import {isBoolean, isNil} from 'lodash';
import {ContextMenuItem} from '../../types/context-menu-item';
import {ContextMenuComponent, ContextMenuSelectEvent} from '@progress/kendo-angular-menu';
import {ContextMenuOperation} from '../../types/context-menu-operation';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {CustomNotificationService} from '../../../global/services/custom-notification.service';
import {ErrorService} from '../../../global/services/error.service';
import {IconSet} from '../../types/icon';

class DropDownDataViewStateCache {
  paginatorDropDown?: IPaginatorBase;
  // quickSearchFilter?: string;
  currentDataItem?: any;
  dataSource?: any;
}

@Component({
  selector: 'cr-dropdown-smart-control',
  templateUrl: './dropdown-smart-control.component.html',
  styleUrls: ['./dropdown-smart-control.component.scss'],
})
export class DropdownSmartControlComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('dropdownList') dropdownList: DropDownListComponent;
  @ViewChild('inputFilter') inputFilter: ElementRef;
  @ViewChild('contextmenu') contextMenu: ContextMenuComponent;
  @ViewChild('contextmenutarget') dropdownWrapper: ElementRef;

  /**
   * Current value. It's value of *valueField* in selected item object.
   */
  @Input() value: any;

  /**
   * Event that will be emitted when selected item change. Emit *valueField* of selected item object.
   */
  @Output() valueChange = new EventEmitter<any>();

  /**
   * Field that contains value in selected item object. Usually it's 'id' field.
   */
  @Input() valueField = 'id';

  /**
   * Field that contains text in selected item object that will be shown. Usually it's 'displayName' field.
   */
  @Input() textField = 'displayName';

  /**
   * Field that contains code in selected item object that will be shown. Usually it's 'code' field.
   */
  @Input() codeField = 'code';

  /**
   * If this field is true then code will be shown in selected item label of dropdown.
   */
  @Input() useCodeInValue = false;

  /**
   * If this field is true then code will be shown in items list of dropdown.
   */
  @Input() useCodeInList = false;

  /**
   * Text that will be in label for smart dropdown.
   */
  @Input() label: string;

  /**
   * Translate key for text that will be in label for smart dropdown. <br>
   * **IMPORTANT** Cannot use with *label*.
   */
  @Input() labelTranslateKey: string;


  @Input() additionalTranslateKeys: string;

  /**
   * If this property is true then smart dropdown won't be editable and *valueChange* and *currentItemValueChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then smart dropdown won't be editable and *valueChange* and *currentItemValueChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * Default selected object
   */
  @Input() unselectedItemValue: any;

  /**
   * Field that contains translate key in selected item that will be shown. <br>
   * **IMPORT** Cannot be used with *textField*.
   */
  @Input() dataTranslateKeyField;

  /**
   * Function that will be called for getting one item by id for initialize this.cache.currentDataItem. <br>
   * **IMPORTANT** Cannot be used with *currentItemValue* property.
   *
   * @param id - ID of required item. <br>
   * @param additional? - addition parameters that passed by *listItemsFunctionAdditionalParameter* property
   * @returns Observable<any> - observable with required item
   */
  @Input() getOneItemFunction: (id: any, additional?: any) => Observable<any>;

  /**
   * Value for initialize this.cache.currentDataItem.
   */
  @Input() currentItemValue: any;

  /**
   * Event that will be emitted when selected item change. Emit selected item object.
   */
  @Output() currentItemValueChange = new EventEmitter<any>();

  /**
   * Value of this field will be placed as second parameter of *getListItemsFunction* and *getOneItemFunction*.
   */
  @Input() listItemsFunctionAdditionalParameter: any;

  /**
   * If this field is true then after *listItemsFunctionAdditionalParameter* change selected item will reset.
   */
  @Input() isCleanListWhenAdditionalParameterChanged = false;

  /**
   * Function that will be called for getting dropdown page. <br>
   * **IMPORTANT** Cannot be used with *dataSource* property.
   *
   * @param paginator - Contains page and page size <br>
   * @param additional? - addition parameters that passed by *listItemsFunctionAdditionalParameter* property
   * @returns Observable<IPaginator<any>> - observable with required item
   */
  @Input() getListItemsFunction: (paginator: IPaginatorBase, additional?: any) => Observable<IPaginator<any>>;

  /**
   * External datasource for local paging. <br>
   * **IMPORTANT** This property is more high priority then *getListItemsFunction*
   */
  @Input() dataSource: IPaginator<any>;

  /**
   * Event that will be emitted for new page in local paging. <br>
   * **IMPORTANT** Cannot be used with *getListItemsFunction*.
   */
  @Output() requestDataSource = new EventEmitter<any>();
  @Output() currentDataItemSelected = new EventEmitter<any>();

  /**
   * Name of cache in dataView state of bookmark. Contains paginator and selected item.
   */
  @Input() dataCacheName = 'cacheForDropdown';

  /**
   * If this value is true then getListFn will be called every time when dropdown open.
   */
  @Input() requestDataWhenOpen = false;

  /**
   * Enable or disable using cache.
   */
  @Input() useCache = true;

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


  // @Input() useQuickSearch = true;

  /**
   * DropdownPopupClass - additional class on dropdown popup context menu.
   * Add additional classes in one string like 'class-1 class-2' with spaces between them
   */
  @Input() dropdownPopupClass: string;

  /**
   * dropdownWrapperClass - additional wrapper class on component.
   * Add additional classes in one string like 'class-1 class-2' with spaces between them
   */
  @Input() dropdownWrapperClass: string;

  /**
   * Context menu operations list.
   */
  @Input() contextMenuOperations: Array<ContextMenuOperation>;

  /**
   * Event that will be emitted when item in context menu will be choosen.
   */
  @Output() navigateToEvent = new EventEmitter<any>();

  /**
   * Emits the dropdownOpened event after opening dropdown
   */
  @Output() dropdownOpened = new EventEmitter<any>();

  /**
   * Emits the dropdownClosed event after closing dropdown
   */
  @Output() dropdownClosed = new EventEmitter<any>();

  /**
   * Permissions settings for grid. If it is boolean then all permissions equal to it value.
   * Also it can be object for more flexible configuration.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for smart dropdown: </b> *smart-dropdown:Component_Name.Data*
   */
  @Input() elementName: string;

  /**
   * Allow to use icon for selected value
   */
  @Input() useIconInValue = false;

  /**
   * Allow to use icon for item of list
   */
  @Input() useIconInList = false;

  /**
   * Default svg icon set
   */
  @Input() iconSet: IconSet = 'icon-set';

  /**
   * Field that contains icon in selected item object. Usually it's 'icon' field.
   */
  @Input() iconField = 'icon';


  /**
   * If this field is not empty then data will be grouped by this field. Else data will be shown without grouping.
   */
  @Input() groupByField: string = null;

  public validationResult: ValidationResult;
  public _parsedPermissionSettings: EditControlPermissions = {};
  public requiredRule: ValidationRule;

  public isLoading = false;
  public dataElementName: string;

  public isDropdownListInitialized = false;
  public isCacheInitialized = false;
  public isFooterVisible = true;
  public cache: DropDownDataViewStateCache;
  public contextMenuItems: Array<ContextMenuItem>;
  private filterValueSubject: Subject<string> = new Subject<string>();

  constructor(protected bookmarkService: BookmarkService,
              private configService: ConfigService,
              private notificationService: CustomNotificationService,
              private errorService: ErrorService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean,
  ) {
    this.initQuickSearchFilterStream();
  }

  ngOnInit(): void {
    this.initPermissions();
    this.initElementName();

    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.requiredRule = this.validator.getRule(this.validationField, ValidationTypes.required);
    }
  }

  ngAfterViewInit(): void {
    this.isDropdownListInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initPermissions();

    // clean list and selected value
    if (this.isCleanListWhenAdditionalParameterChanged && changes.listItemsFunctionAdditionalParameter
      && this.isDropdownListInitialized) {
      // this.onSelectionChange({id: null, name: ''});
      if (this.cache && this.cache.dataSource) {
        this.cache.dataSource = [];
      }

      if (this.cache && this.cache.paginatorDropDown) {
        this.cache.paginatorDropDown.size = Number(this.configService.getConfig().pagingDropdownSize);
        this.cache.paginatorDropDown.page = Number(this.configService.getConfig().pagingDropdownPage);
        this.cache.paginatorDropDown.skip = 0;
        this.cache.paginatorDropDown.quickSearchFilter = '';
      }

      // initialize unselected value parameters (unselectedItemValue)
      if (!changes.unselectedItemValue) {
        this.initUnselectedItemValue();
      }

      setTimeout(() => {
        this.valueChange.emit(null);
        if (this.unselectedItemValue) {
          this.currentItemValueChange.emit(this.unselectedItemValue);
        }
      }, 0);
      // this.dropdownList.value = null;
    }
    // revalidate after changing value
    if (!!changes.value && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.value);
    }

    // initialize cache
    if (!this.isCacheInitialized && changes.dataCacheName) {
      this.initDataViewState(changes.dataCacheName);
    }

    // initialize unselected value parameters (unselectedItemValue)
    if (this.isCacheInitialized && !!changes.unselectedItemValue) {
      this.initUnselectedItemValue();
    }

    // load data item by value (ID) or from cache
    if (this.isCacheInitialized && changes.value) {
      this.loadCurrentDataItemByValue(changes.value);
    }

    // load data item from input parameters (currentItemValue) or from cache
    if (this.isCacheInitialized && changes.currentItemValue && changes.currentItemValue.currentValue) {
      if (!this.cache.currentDataItem
        || (this.currentItemValue && this.currentItemValue[this.valueField] !== this.cache.currentDataItem[this.valueField])
        || (changes.currentItemValue.currentValue[this.valueField] !== this.currentItemValue[this.valueField])) {
        this.cache.currentDataItem = this.currentItemValue;
      }
    }

    // load data from @Input() dataSource
    if (changes.dataSource && changes.dataSource.currentValue) {
      this.loadDataFromExternalDataSource();
    }

    // initialize context menu
    if (changes.contextMenuOperations && changes.contextMenuOperations.currentValue) {
      this.contextMenuItems = new Array<ContextMenuItem>();
      this.contextMenuOperations.forEach(item => {
        if (item === 'copyToClipboard') {
          this.contextMenuItems.push({
            operation: 'copyToClipboard',
            iconSvg: 'icon-copy-to-clipboard',
            textTranslateKey: 'COMMON.CONTROL_CONTEXT_MENU.COPY_TO_CLIPBOARD',
          });
        }
        if (item === 'navigateTo') {
          this.contextMenuItems.push({
            operation: 'navigateTo',
            iconSvg: 'icon-external-link',
            textTranslateKey: 'COMMON.CONTROL_CONTEXT_MENU.NAVIGATE_TO',
          });
        }
      });
    }

    if (changes.permissionSettings) {
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
    if (this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  // initialize quick search filter stream
  initQuickSearchFilterStream(): void {
    this.filterValueSubject.asObservable().pipe(
      // untilDestroyed(this),
      filter(Boolean),
      debounceTime(250),
      // distinctUntilChanged()
    )
      .subscribe((v: string) => {
          this.cache.paginatorDropDown.page = 1;
          this.cache.paginatorDropDown.quickSearchFilter = v !== '[#clear]' ? v : '';
          this.getDataItemList();
        },
      );
  }

  cleanDropDown(): void {
    if (this.isDropdownListInitialized) {
      if (this.cache && this.cache.dataSource) {
        this.cache.dataSource = (this.cache.dataSource as Array<any>).filter(f => f[this.valueField] === this.value);
      }
      if (this.cache && this.cache.paginatorDropDown) {
        this.cache.paginatorDropDown.size = Number(this.configService.getConfig().pagingDropdownSize);
        this.cache.paginatorDropDown.page = Number(this.configService.getConfig().pagingDropdownPage);
        this.cache.paginatorDropDown.skip = 0;
        this.cache.paginatorDropDown.quickSearchFilter = '';
      }
    }
  }

  // initialize data views state
  initDataViewState(cacheNameSimpleChanges: SimpleChange): void {
    if (this.useCache) {
      this.cache = this.bookmarkService.getCurrentDataViewState(cacheNameSimpleChanges.currentValue);
    } else {
      this.cache = {};
    }

    if (!this.cache.paginatorDropDown) {
      this.cache.paginatorDropDown = {
        size: Number(this.configService.getConfig().pagingDropdownSize),
        page: Number(this.configService.getConfig().pagingDropdownPage),
        skip: 0,
        quickSearchFilter: '',
      };
    }

    this.isCacheInitialized = true;
  }

  // load unselected value parameters (unselectedItemValue)
  initUnselectedItemValue(): void {
    if (!!this.unselectedItemValue) {
      if (!!this.cache.dataSource) {
        if (!this.cache.dataSource.some(item => item[this.valueField] === this.unselectedItemValue[this.valueField]
          && item[this.textField] === this.unselectedItemValue[this.textField])) {
          this.cache.dataSource.unshift(this.unselectedItemValue);
        }
      } else {
        this.cache.dataSource = [];
        this.cache.dataSource.unshift(this.unselectedItemValue);
      }
    }
  }

  // load data item by value (ID) or from cache
  loadCurrentDataItemByValue(change: SimpleChange): void {
    // check and set unselected values as currentDataItem if necessary
    if (this.unselectedItemValue && this.unselectedItemValue[this.valueField] === this.value) {
      this.cache.currentDataItem = this.unselectedItemValue;
    }
    // check if changes necessary
    if (!this.cache.currentDataItem || this.value !== this.cache.currentDataItem[this.valueField]
      || (change.currentValue !== this.value)) {
      // set from (@Input() currentItemValue) if used
      if (this.currentItemValue) {
        this.cache.currentDataItem = this.currentItemValue;
      }
      // load from (@Input() getOneItemFunction)
      if (this.getOneItemFunction && !isEmptyObject(this.value)) {
        this.loadCurrentDataItemByOneItemFunction(this.value);
      }
    }
  }

  // This function used to load One selected item by id
  loadCurrentDataItemByOneItemFunction(id: any): void {
    this.initPermissions();
    if (id !== undefined && id !== null && this._parsedPermissionSettings.isAccessRead) {
      this.isLoading = true;
      this.getOneItemFunction(id, this.listItemsFunctionAdditionalParameter)
        .pipe(
          tap(() => this.isLoading = false),
          catchError(err => {
            this.isLoading = false;
            return throwError(err);
          }),
        )
        .subscribe(value => {
            this.cache.currentDataItem = value;

            if (value) {
              if (!!this.cache.dataSource) {
                if (!this.cache.dataSource.some(item => item[this.valueField] === value[this.valueField])) {
                  this.cache.dataSource.push(value);
                }
              } else {
                this.cache.dataSource = [];
                this.cache.dataSource.push(value);
              }
            }
          },
          error => this.notificationService.showDialogError(this.errorService.getMessagesToShow(error.errors)));
    }
  }

  // load data from @Input() dataSource
  loadDataFromExternalDataSource(): void {
    this.cache.paginatorDropDown.size = this.dataSource.size;
    this.cache.paginatorDropDown.page = this.dataSource.page;
    this.cache.paginatorDropDown.elementsCount = this.dataSource.elementsCount;
    this.cache.paginatorDropDown.totalElements = this.dataSource.totalElements;
    this.cache.paginatorDropDown.totalPages = this.dataSource.totalPages;
    this.isFooterVisible = this.dataSource.totalPages > 1;
    this.cache.dataSource = this.dataSource.responseList;

    // load unselected value parameters (unselectedItemValue)
    this.initUnselectedItemValue();

    // load current data item
    if (!!this.cache.dataSource) {
      if (!this.cache.dataSource.some(item => item[this.valueField] === this.cache.currentDataItem[this.valueField])) {
        this.cache.dataSource.push(this.cache.currentDataItem);
      }
    } else {
      this.cache.dataSource = [];
      this.cache.dataSource.push(this.cache.currentDataItem);
    }
  }

  // get data from external or by calling getListItemsFunction
  getDataItemList(): void {
    if (!this.getListItemsFunction) {
      this.requestDataItemList();
    } else {
      this.loadDataItemList();
    }
  }

  // request data from external
  requestDataItemList(): void {
    this.requestDataSource.emit(this.cache.paginatorDropDown);
  }

  // Used to load list of items by current pagination and filter settings
  loadDataItemList(): void {
    this.isLoading = true;
    this.getListItemsFunction(this.cache.paginatorDropDown, this.listItemsFunctionAdditionalParameter)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(err => {
          this.isLoading = false;
          return throwError(err);
        }),
      )
      .subscribe(value => {
          const tmpSource = value?.responseList;
          this.cache.paginatorDropDown.size = value.size;
          this.cache.paginatorDropDown.page = value.page;
          this.cache.paginatorDropDown.elementsCount = value.elementsCount;
          this.cache.paginatorDropDown.totalElements = value.totalElements;
          this.cache.paginatorDropDown.totalPages = value.totalPages;
          this.isFooterVisible = value.totalPages > 1;

          if (!!tmpSource) {
            if (!!this.cache.currentDataItem && !!this.cache.currentDataItem[this.valueField]
              && !tmpSource.some(item => item[this.valueField] === this.cache.currentDataItem[this.valueField])) {
              // tmpSource.push(this.cache.currentDataItem);
            }
            if (!!this.unselectedItemValue && !tmpSource.some(item => item[this.valueField] === this.unselectedItemValue[this.valueField]
              && item[this.textField] === this.unselectedItemValue[this.textField])) {
              tmpSource.unshift(this.unselectedItemValue);
            }

            if (!isNil(this.groupByField) && tmpSource.length) {
              this.cache.dataSource = groupBy([{}, ...tmpSource], [{field: this.groupByField}]);
            } else {
              this.cache.dataSource = tmpSource;
            }
          } else {
            this.cache.dataSource = [];
            this.cache.dataSource.push(this.cache.currentDataItem);
          }
        },
        error => this.notificationService.showDialogError(this.errorService.getMessagesToShow(error.errors)));
  }

  onSelectionChange(event: any): void {
    //this.onDropDownDisableClose(false);
    this.cache.currentDataItem = event;
    if (event && (event[this.valueField] !== undefined)) {
      this.valueChange.emit(event[this.valueField]);
      this.currentItemValueChange.emit(event);
    }
    // validate value
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, event[this.valueField]);
    }

    this.currentDataItemSelected.emit(this.cache.currentDataItem);
  }

  onDropdownOpen($event: PreventableEvent): void {
    this.switchKeyboardPaging(true);
    setTimeout(() => {
      if (!isNil(this.inputFilter) && !isNil(this.inputFilter.nativeElement)) {
        this.inputFilter.nativeElement.focus();
      }
    }, 0);
    this.cleanDropDown();
    // this.logger.debug(`DropdownSmartControlComponent: onDropdownOpen : this.requestDataWhenOpen=${this.requestDataWhenOpen}`);
    if (this.requestDataWhenOpen) {
      // request data every time when dropdown opens
      this.getDataItemList();
    } else {
      // request data only if they empty
      if (!this.cache.dataSource ||
        ((this.unselectedItemValue && this.cache.dataSource.length <= 2) || this.cache.dataSource.length <= 1)) {
        this.getDataItemList();
      }
    }
    this.dropdownOpened.emit(this.dropdownWrapper);
  }

  onFilterChange($event: any): void {
    this.filterValueSubject.next($event !== '' ? $event : '[#clear]');
  }

  onDropdownClose($event: PreventableEvent): void {
    // $event.preventDefault();
    console.log('Close smart dropdown');
    this.switchKeyboardPaging(false);
    this.dropdownClosed.emit(this.dropdownWrapper);
  }

  onPrevPage(): void {
    if (this.cache.paginatorDropDown.page > 1) {
      this.cache.paginatorDropDown.page--;
      this.getDataItemList();
    }

  }

  onNextPage(): void {
    if (this.cache.paginatorDropDown.page < this.cache.paginatorDropDown.totalPages) {
      this.cache.paginatorDropDown.page++;
      this.getDataItemList();
    }
  }

  onBlur(event: FocusEvent): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.value);
    }
  }

  switchKeyboardPaging(isPageable: boolean): void {
    const bodyTag = document.body;
    if (isPageable) {
      document.addEventListener('keydown', this.onKeyUpForPaging);
    } else {
      document.removeEventListener('keydown', this.onKeyUpForPaging);
    }
  }

  onKeyUpForPaging = (event: KeyboardEvent) => {
    if (event.altKey && event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      this.onNextPage();
    }
    if (event.altKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      this.onPrevPage();
    }
  };

  onSelectContextMenu($event: ContextMenuSelectEvent) {
    if (!isNil($event.item)) {
      const selectedItem = $event.item as ContextMenuItem;
      if (selectedItem.operation === 'copyToClipboard') {

        let textToClipboard = '';
        if (isNil(this.cache?.currentDataItem)) {
          if (!isNil(this.dropdownList.getText())) {
            textToClipboard = this.dropdownList.getText();
          }
        } else {
          if (!isNil(this.codeField) && !isNil(this.cache?.currentDataItem[this.codeField])) {
            textToClipboard += this.cache.currentDataItem[this.codeField] + ' ';
          }
          if (!isNil(this.textField) && !isNil(this.cache.currentDataItem[this.textField])) {
            textToClipboard += this.cache.currentDataItem[this.textField];
          }
        }

        if (textToClipboard.trim()) {
          console.log(textToClipboard);
          copyToClipboard(textToClipboard);
        }

      } else if (selectedItem.operation === 'navigateTo') {
        if (!isNil(this.cache?.currentDataItem)) {
          this.navigateToEvent.emit(this.cache.currentDataItem);
        }
      }
    }
  }

  onShowContextMenu($event: MouseEvent) {
    this.contextMenu.show({left: $event.pageX, top: $event.pageY});
  }
}

