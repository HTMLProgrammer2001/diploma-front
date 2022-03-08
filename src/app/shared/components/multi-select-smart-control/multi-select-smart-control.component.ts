import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PreventableEvent} from '@progress/kendo-angular-dropdowns';
import {IPaginatorBase} from '../../types/paginator-base';
import {BookmarkService} from '../../../global/services/bookmark.service';
import {ConfigService} from '../../../global/services/config.service';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {IPaginator} from '../../types/paginator';
import {isBoolean, isEmpty, isNil} from 'lodash';
import {Validator} from '../../types/validation/validator';
import {ValidationResult} from '../../types/validation/validation-result';
import {ValidationRule} from '../../types/validation/validation-rule';
import {ValidationTypes} from '../../types/validation/validation-types';
import {EditControlPermissions} from '../../types/edit-control-permissions';
import {ErrorService} from '../../../global/services/error.service';
import {CustomNotificationService} from '../../../global/services/custom-notification.service';


class MultiselectDataViewStateCache {
  paginatorDropDown?: IPaginatorBase;
  currentDataItems?: Array<any>;
  dataSource?: any;
}

@Component({
  selector: 'cr-multi-select-smart-control',
  templateUrl: './multi-select-smart-control.component.html',
  styleUrls: ['./multi-select-smart-control.component.scss']
})
export class MultiSelectSmartControlComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Reference to multiselect component.
   */
  @ViewChild('multiSelectComponent', {static: false}) multiselectComponent;

  /**
   * Current selected ids. It's value of *valueField* in selected item objects.
   */
  @Input() values: Array<number>;

  /**
   * Event that will be emitted when selected items change. Emit object with *valueField* of selected items object.
   */
  @Output() valuesChange = new EventEmitter<Array<number>>();

  /**
   * Field that contains value in selected item object. Usually it's 'id' field.
   */
  @Input() valueField = 'id';

  /**
   * Field that contains text in selected item object that will be shown. Usually it's 'displayName' field.
   */
  @Input() textField = 'displayName';

  /**
   * Translate key for text that will be in label for multiselect. <br>
   * **IMPORTANT** Cannot use with *dataLabel*.
   */
  @Input() translateKeys: string;

  /**
   * Text that will be in label for multiselect.
   */
  @Input() dataLabel: string;

  /**
   * If this property is true then multiselect won't be editable and *valuesChange* and *currentItemValuesChange* won't trigger. <br>
   * Appearance won't change.
   */
  @Input() isReadOnly = false;

  /**
   * If this property is true then multiselect won't be editable and *valuesChange* and *currentItemValuesChange* won't trigger. <br>
   * Appearance will change.
   */
  @Input() isDisabled = false;

  /**
   * If this field is true then multiselect will show count of selected items instead list of selected items.
   */
  @Input() isSimpleMode = false;
  // @Input() unselectedItemValue: any;

  /**
   * Function that will be called for getting one item by id for initialize this.cache.currentDataItem. <br>
   * **IMPORTANT** Cannot be used with *currentItemValue* property.
   *
   * @param ids - ID of required items. <br>
   * @param additional? - addition parameters that passed by *listItemsFunctionAdditionalParameter* property
   * @returns Observable<any> - observable with required item
   */
  @Input() getSelectedItemsFunction: (ids: Array<any>, additional?: any) => Observable<any>;

  /**
   * Value for initialize this.cache.currentDataItems.
   */
  @Input() currentItemValues: Array<any>;

  /**
   * Event that will be emitted when selected items change. Emit selected item objects.
   */
  @Output() currentItemValuesChange = new EventEmitter<Array<any>>();

  /**
   * Value of this field will be placed as second parameter of *getListItemsFunction* and *getSelectedItemsFunction*.
   */
  @Input() listItemsFunctionAdditionalParameter: any;

  /**
   * Function that will be called for getting dropdown page. <br>
   * **IMPORTANT** Cannot be used with *dataSource* property.
   *
   * @param paginator - Contains page and page size
   * @param values - selected values
   * @param additional? - addition parameters that passed by *listItemsFunctionAdditionalParameter* property
   * @returns Observable<IPaginator<any>> - observable with required items
   */
  @Input() getListItemsFunction: (paginator: IPaginatorBase, values: Array<any>, additional?: any) => Observable<IPaginator<any>>;

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

  /**
   * Name of cache in dataView state of bookmark. Contains paginator and selected item.
   */
  @Input() dataCacheName = 'CacheForMultiselect';

  /**
   * If this value is true then getListFn will be called every time when dropdown open.
   */
  @Input() requestDataWhenOpen = false;

  /**
   * Enable or disable using cache.
   */
  @Input() useCache = true;

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
   * Permissions settings for grid. If it is boolean then all permissions equal to it value.
   * Also it can be object for more flexible configuration.
   */
  @Input() permissionSettings: boolean | EditControlPermissions = true;

  /**
   * Property for selectors in automation testing.<br>
   * <b>Template for smart dropdown: </b> *smart-dropdown:Component_Name.Data*
   */
  @Input() elementName: string;

  public _parsedPermissionSettings: EditControlPermissions = {};
  public validationResult: ValidationResult;
  public requiredRule: ValidationRule;
  public dataElementName: string;

  public isLoading = false;
  isCacheInitialized = false;
  isCloseDisabled = false;
  isFooterVisible = true;
  cache: MultiselectDataViewStateCache;

  private filterValueSubject: Subject<string> = new Subject<string>();

  constructor(protected bookmarkService: BookmarkService,
              private configService: ConfigService,
              private notificationService: CustomNotificationService,
              private errorService: ErrorService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean) {
    // this.initQuickSearchFilterStream();
  }

  ngOnInit(): void {
    if (!!this.validator && this.validationField) {
      this.validationResult = this.validator.getResult(this.validationField);
      this.requiredRule = this.validator.getRule(this.validationField, ValidationTypes.required);
    }

    this.initPermissions();
    this.initElementName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // initialize Cache
    if (!this.isCacheInitialized && changes.dataCacheName) {
      this.initDataViewState(changes.dataCacheName);
    }

    // load data item by values (IDs) or from cache
    if (this.isCacheInitialized && changes.values) {
      this.loadCurrentDataItemsByValues();
    }

    // load data item from input parameters (currentItemValue) or from cache
    if (this.isCacheInitialized && changes.currentItemValues && changes.currentItemValues.currentValue) {
      if (!this.cache.currentDataItems
        || (this.currentItemValues && this.currentItemValues[this.valueField] !== this.cache.currentDataItems[this.valueField])
        || (changes.currentItemValues.currentValue[this.valueField] !== this.currentItemValues[this.valueField])) {
        this.cache.currentDataItems = this.currentItemValues;
      }
    }

    if (!!changes.values && !!this.validator && !!this.validationResult && !!this.validationField && !this.validationResult.isValid) {
      this.validator.validateField(this.validationField, this.values);
    }

    // load data from @Input() dataSource
    if (changes.dataSource && changes.dataSource.currentValue) {
      this.loadDataFromExternalDataSource();
    }

    if(changes.permissionSettings){
      this.initPermissions();
    }

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
        quickSearchFilter: ''
      };
    }
    this.isCacheInitialized = true;
  }

  // load data item by value (ID) or from cache
  loadCurrentDataItemsByValues(): void {
    // check if changes necessary
    if (!this.cache.currentDataItems
      || !this.isValuesEqualToDataItems(this.values, this.cache.currentDataItems)) {
      // set from (@Input() currentItemValue) if used
      if (this.currentItemValues) {
        this.cache.currentDataItems = this.currentItemValues;
      }
      // load from (@Input() getOneItemFunction)
      if (this.getSelectedItemsFunction) {
        this.loadCurrentDataItemByOneItemFunction(this.values);
      }
    }
  }

  // check if values equal to dataItems
  isValuesEqualToDataItems(values: Array<number>, dataItems: Array<any>): any {
    let result = true;

    if ((isEmpty(values) && !isEmpty(dataItems)) || (!isEmpty(values) && isEmpty(dataItems))) {
      result = false;
    } else if (!isEmpty(values) && !isEmpty(dataItems)) {
      if (values.length !== dataItems.length) {
        result = false;
      } else {
        const difference = values.filter((v) => !dataItems.some((d) => v[this.valueField] === d[this.valueField]));
        result = difference.length === 0;
      }
    }

    return result;
  }

  // This function used to load One selected item by id
  loadCurrentDataItemByOneItemFunction(idList: Array<any>): void {
    this.initPermissions();
    if (idList && idList.length > 0 && this._parsedPermissionSettings.isAccessRead) {
      this.isLoading = true;
      this.getSelectedItemsFunction(idList, this.listItemsFunctionAdditionalParameter)
        .pipe(
          tap(() => this.isLoading = false),
          catchError(err => {
            this.isLoading = false;
            return throwError(err);
          })
        )
        .subscribe(
          value => this.cache.currentDataItems = value,
          error => this.notificationService.showDialogError(this.errorService.getMessagesToShow(error.errors))
      );
    } else {
      this.cache.currentDataItems = null;
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
    this.getListItemsFunction(this.cache.paginatorDropDown, this.values, this.listItemsFunctionAdditionalParameter)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(err => {
          this.isLoading = false;
          return throwError(err);
        })
      )
      .subscribe(value => {
        this.cache.dataSource = value.responseList;
        this.cache.paginatorDropDown.size = value.size;
        this.cache.paginatorDropDown.page = value.page;
        this.cache.paginatorDropDown.elementsCount = value.elementsCount;
        this.cache.paginatorDropDown.totalElements = value.totalElements;
        this.cache.paginatorDropDown.totalPages = value.totalPages;
        this.isFooterVisible = value.totalPages > 1;
      },
        error => this.notificationService.showDialogError(this.errorService.getMessagesToShow(error.errors)));
  }

  onSelectionChange(event: any[]): void {
    this.cache.currentDataItems = event;
    if (!isEmpty(event)) {
      this.valuesChange.emit(event.map(item => item[this.valueField]));
      this.currentItemValuesChange.emit(event);
    } else {
      this.valuesChange.emit([]);
      this.currentItemValuesChange.emit([]);
    }
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, event[this.valueField]);
    }
  }

  onDropdownOpen(): void {
    if (this.requestDataWhenOpen) {
      // request data every time when dropdown opens
      this.getDataItemList();
    } else {
      // request data only if they empty
      if (!this.cache.dataSource || this.cache.dataSource.length <= 1) {
        this.getDataItemList();
      }
    }

  }

  onFilterChange($event: string): void {
    this.filterValueSubject.next($event !== '' ? $event : '[#clear]');
  }

  onDropdownClose($event: PreventableEvent): void {
    if (this.isCloseDisabled) {
      $event.preventDefault();
    }

    setTimeout(() => {
      if (!this.isCloseDisabled) {
        this.multiselectComponent.toggle(false);
      }
    });
  }

  onDropDownDisableClose(isDisableClose: boolean): void {
    this.isCloseDisabled = isDisableClose;
    setTimeout(() => {
      if (!this.isCloseDisabled) {
        this.multiselectComponent.toggle(false);
      }
    });
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

  ngAfterViewInit(): void {
    if(!this.multiselectComponent){
      return;
    }

    this.multiselectComponent.filterChange.asObservable().pipe(
      // untilDestroyed(this),
      debounceTime(250),
      distinctUntilChanged()
    )
      .subscribe((v: string) => {
          this.cache.paginatorDropDown.page = 1;
          this.cache.paginatorDropDown.quickSearchFilter = v !== '[#clear]' ? v : '';
          this.getDataItemList();
        }
      );
  }

  onBlur(event: FocusEvent): void {
    if (!!this.validator && this.validationField) {
      this.validator.validateField(this.validationField, this.values);
    }
  }
}
