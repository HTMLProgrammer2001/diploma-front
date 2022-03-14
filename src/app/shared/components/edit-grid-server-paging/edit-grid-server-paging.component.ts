import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectableSettings,
  SelectionEvent,
  SortSettings
} from '@progress/kendo-angular-grid';
import {IPaginator} from '../../types/paginator';
import {isBoolean, isEmpty, isNil} from 'lodash';
import {ConfigService} from '../../../global/services/config/config.service';
import {TooltipDirective} from '@progress/kendo-angular-tooltip';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {IEditGridColumnSetting} from '../../types/edit-grid/edit-grid-column-settings';
import {PagerSettings} from '@progress/kendo-angular-grid/dist/es2015/pager/pager-settings';
import {RemoveEvent} from '@progress/kendo-angular-grid/dist/es2015/editing/remove-event-args.interface';
import {EditGridRemoveEvent} from '../../types/edit-grid/edit-grid-remove-event';
import {EditGridUpdateEvent} from '../../types/edit-grid/edit-grid-update-event';
import {SaveEvent} from '@progress/kendo-angular-grid/dist/es2015/editing/save-event-args.interface';
import {Validator} from '../../types/validation/validator';
import {CustomNotificationService} from '../../../global/services/custom-notification.service';
import {of, ReplaySubject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {ShowOption} from '@progress/kendo-angular-tooltip/dist/es/models/show.option.type';
import {SortDescriptor} from '@progress/kendo-data-query';
import {IPaginatorBase} from '../../types/paginator-base';
import {PaginatorSort} from '../../types/paginator-sort';
import {EditGridChangeItemEvent} from '../../types/edit-grid/edit-grid-change-item-event';

export type EditGridStatus = 'createOpen' | 'createClose' | 'updateOpen' | 'updateClose' | 'validationFailed';

@Component({
  selector: 'cr-edit-grid-server-paging',
  templateUrl: './edit-grid-server-paging.component.html',
  styleUrls: ['./edit-grid-server-paging.component.scss']
})
export class EditGridServerPagingComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  /**
   * Data for display on grid
   */
  @Input() dataSource: IPaginator<any>;

  /**
   * Property for tooltip show trigger. Default is hover
   */
  @Input() showOn: ShowOption = 'hover';

  /**
   * Array of settings for column in grid.
   */
  @Input() columnSettings: Array<IEditGridColumnSetting>;

  /**
   * Set table as sortable. Required if use sortable option in column settings.
   */
  @Input() sortable: SortSettings;

  /**
   * Default sort state of grid. <br>
   * **REQUIRED** that *sortable* is true.
   */
  @Input() sortableState: PaginatorSort[];

  /**
   * If this field is true then grid has pagination.
   */
  @Input() pageable: boolean;

  /**
   * This event fired when page or sorting changed.
   */
  @Output() pageChangeEvent = new EventEmitter<IPaginatorBase>();

  /**
   * If this field is false then delete button won't show.
   */
  @Input() allowDeleteAction: boolean;

  /**
   * If this field is false then row will be deleted from grid page without reselecting data from server.
   */
  @Input() isRefreshOnDelete: boolean;

  /**
   * This event fired when user click on remove button in grid.
   */
  @Output() deleteActionEvent = new EventEmitter<EditGridRemoveEvent>();

  /**
   * If this field is false then update button won't show.
   */
  @Input() allowUpdateAction: boolean;

  /**
   * If this field is false then row will be replaced on grid page without reselecting data from server.
   */
  @Input() isRefreshOnUpdate: boolean;

  /**
   * This event fired when user click on update button in grid.
   */
  @Output() updateActionEvent = new EventEmitter<EditGridUpdateEvent>();

  /**
   * If this field is false then add button won't show.
   */
  @Input() allowCreateAction: boolean;

  /**
   * If this field is false then row will be added on the top of current page without resecting data from error.
   */
  @Input() isRefreshOnCreate: boolean;

  /**
   * if this field is true then add form will be closed automatically after adding new row.
   * Else add form can be closed only by clicking close button
   */
  @Input() isCloseEditorAfterAdd: boolean;

  /**
   * This event fired when user click on Add button in grid.
   */
  @Output() createActionEvent = new EventEmitter<EditGridUpdateEvent>();

  /**
   * If this field is true then will be used Kendo Grid Component method for auto fit columns.
   */
  @Input() autoFitColumns: boolean;

  /**
   * If this field is true then columns can be resized
   */
  @Input() resizable: boolean;

  /**
   * This is field by which will work selection. It MUST be unique for all pages in grid (id or etc).
   * If this field is empty then grid is not selectable
   */
  @Input() uniqueField: string;

  /**
   * This event will be called on click on link or button action column.
   */
  @Output() cellClickEvent = new EventEmitter<any>();

  /**
   * Validator object for validating edit and add form.
   */
  @Input() validator: Validator;

  /**
   * Row validator is a function that receive dataItem and return error object with error messages,
   * where key is field name and value is error message.
   *
   * *IMPORTANT* this validation work only for inCellEditing inputs.
   */
  @Input() inCellValidator: (dataItem: any) => Record<string, string>;

  /**
   * If this field is true then will be enabled multiselect mode with checkboxes.
   */
  @Input() allowMultiSelect: boolean;

  /**
   * Array of selected rows by default.
   *
   * Row will be checked by unique field.
   * For example if uniqueField is 'id' then this field must contain array of ids.
   */
  @Input() initialSelectedRows: Array<any>;

  /**
   * If this field is 'id' then selectionChange event will emit array of uniqueFields and initialSelectedRows will accept array of ids.
   * Else selectionChange event will emit array of objects and initialSelectedRows will accept array of objects.
   */
  @Input() selectionDataMode: 'id' | 'object' = 'id';

  /**
   * Emitter for grid selection change.
   * Emit array of rows unique field values. If multiselect is disabled then emit array with one or zero items.
   */
  @Output() selectionChanged: EventEmitter<Array<any>> = new EventEmitter();

  /**
   * Name of cache that will contain info about this grid.
   */
  @Input() dataCacheName: string;

  /**
   * If this field is true then data for grid is loading.
   */
  @Input() isLoading: boolean;

  /**
   * This event will be emitted on checkbox, dropdown or date picker value change that in read edit mode.
   */
  @Output() inCellEditingChange = new EventEmitter<InCellEditingChangeEvent>();

  /**
   * Permissions settings for grid. If it is boolean then all permissions equal to it value.
   * Also it can be object for more flexible configuration.
   */
  @Input() permissionSettings: boolean | EditGridPermissionSettingsConfig = true;

  /**
   * This method control edit button per row. If it returns true then edit button will be shown else hidden.
   */
  @Input() disableRowUpdateIf: (dataItem: any, column: IEditGridColumnSetting, isNew: boolean) => boolean;

  /**
   * This method control delete button per row. If it returns true then delete button will be shown else hidden.
   */
  @Input() disableRowDeleteIf: (dataItem: any, column: IEditGridColumnSetting, isNew: boolean) => boolean;

  /**
   * Data set element name that will be used for testing
   */
  @Input() elementName: string;

  /**
   * If true then add 90 px empty column at end for sorter.
   */
  @Input() hasSorter: boolean;

  /**
   * Event that called when grid status changed
   */
  @Output() changeStatus: EventEmitter<EditGridStatus> = new EventEmitter<EditGridStatus>();


  /**
   * Event that called when grid edit item change (user type value on add or edit row)
   */
  @Output() editItemChange: EventEmitter<EditGridChangeItemEvent> = new EventEmitter<EditGridChangeItemEvent>();

  /**
   * Ref on tooltip directive for using in onFilterTooltip method.
   */
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  /**
   * Ref on kendo grid element.
   */
  @ViewChild(GridComponent, {static: false}) private grid: GridComponent;

  /**
   * Ref on paging footer of grid to delete all tooltips.
   */
  @ViewChild('paging') private pagingComponent: ElementRef;

  @ViewChild('gridComponent') private gridWrapper: ElementRef;

  /**
   * Date format to display in 'date' type columns.
   */
  public currentDateFormatPattern: string;

  /**
   * Date-time format to display in 'date-time' type columns.
   */
  public currentDateTimeFormatPattern: string;

  /**
   * Settings of paginator that using in grid web-template.
   */
  public pageableSettings: PagerSettings | boolean;

  /**
   * Grid data that display on kendo grid.
   */
  public gridView: GridDataResult;

  /**
   * Quantity of entities to skip. Need to kendo for calculate indexes.
   */
  public skip: number;

  /**
   * Grid cache
   */
  public cache: SimpleGridDataViewStateCache = {};
  public isSelectable: boolean;
  public _parsedPermissionSettings: EditGridPermissionSettingsConfig;
  private onDestroy = new ReplaySubject(1);
  public dataElementName: string;

  /**
   * If this function return true then row is selected otherwise not selected.
   *
   * @param e RowArgs
   */
  public onIsRowSelected = (e: RowArgs) => {
    //if grid is not in select mode then row cannot be selected
    if (!this.isSelectable) {
      return false;
    }

    //if cache contains current item uniqueField than this row selected.
    if (!isNil(this.cache.selectedRows) && !isEmpty(this.cache.selectedRows)) {
      if (this.selectionDataMode === 'id') {
        return this.cache.selectedRows.includes(e.dataItem[this.uniqueField]);
      } else {
        return this.cache.selectedRows.map(row => row[this.uniqueField]).includes(e.dataItem[this.uniqueField]);
      }
    }
  };

  constructor(private configService: ConfigService,
              private bookmarkService: BookmarkService,
              private customNotificationService: CustomNotificationService,
              @Inject('IS_ELEMENT_NAME_ENABLED') private isElementNameEnabled: boolean) {
    this.currentDateFormatPattern = this.configService.getConfig().dateFormat;
    this.currentDateTimeFormatPattern = this.configService.getConfig().dateTimeFormat;
  }

  ngOnInit(): void {
    // initialize paging
    this.initPaging();
    this.initSelectable();

    this.initPermissions();
    this.initElementName();

    setTimeout(() => {
      // initialize cache
      this.initDataViewState();
      this.renderGridView();

      if (!isNil(this.validator)) {
        this.cache.validator = this.validator;
      }

      if (this.cache.isEditModeInProgress && this.cache.validator) {
        this.cache.validator.setDto(this.cache.changeItem);
      }
    });
  }

  public initSelectable() {
    if (!isNil(this.uniqueField)) {
      this.isSelectable = true;
    }
  }

  initElementName() {
    if (this.elementName && this.isElementNameEnabled) {
      this.dataElementName = this.elementName;
    }
  }

  public ngAfterViewInit(): void {
    this.offTitlesOnPaging();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //rerender views on datasource change
    if (changes.dataSource && changes.dataSource.firstChange === false && changes.dataSource.currentValue) {
      this.renderGridView();
    }

    if (changes.dataSource || changes.columnSettings) {
      this.columnSettings.map(column => {
        if (column.dropdownOptions?.usePrimitiveForBinding) {
          this.dataSource?.responseList.map(item => this.loadDropdownItemById(item[column.field], column).subscribe());
        }
      });
    }

    //if data or initial selected rows array changed then recalculate currently selected items.
    if (changes.dataSource || changes.initialSelectedRows) {
      if (this.initialSelectedRows && this.cache) {
        this.cache.selectedRows = [...new Set(this.initialSelectedRows)];
      }
    }

    if (changes.sortableState) {
      setTimeout(() => {
        if(this.grid) {
          //parse our type to kendo SortDescriptor
          this.grid.sort = this.sortableState.map(el => ({field: el.field, dir: el.dir}));
        }
      });
    }

    if (changes.validator && !isNil(changes.validator.currentValue) && !isNil(this.cache)) {
      this.cache.validator = changes.validator.currentValue;
    }

    if (changes.permissionSettings) {
      this.initPermissions();
    }
  }

  //Function that parse permission settings
  initPermissions() {
    if (isBoolean(this.permissionSettings) || isNil(this.permissionSettings)) {
      this._parsedPermissionSettings = {
        isAccessCreate: !!this.permissionSettings,
        isAccessDelete: !!this.permissionSettings,
        isAccessRead: !!this.permissionSettings,
        isAccessUpdate: !!this.permissionSettings
      };
    } else {
      this._parsedPermissionSettings = {
        isAccessCreate: this.permissionSettings.isAccessCreate ?? true,
        isAccessRead: this.permissionSettings.isAccessRead ?? true,
        isAccessUpdate: this.permissionSettings.isAccessUpdate ?? true,
        isAccessDelete: this.permissionSettings.isAccessDelete ?? true
      };
    }

    if (this.cache?.isEditModeInProgress) {
      if (!this._parsedPermissionSettings.isAccessRead ||
        (this.cache.isNew && !this._parsedPermissionSettings.isAccessCreate) ||
        (!this.cache.isNew && !this._parsedPermissionSettings.isAccessUpdate)) {
        this.closeEditor();
      }
    }
  }

  /**
   * This method delete titles on paging elements (like prev or next button).
   */
  offTitlesOnPaging() {
    this.pagingComponent?.nativeElement.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
  }

  /**
   * This method calculate when to show tooltips.
   * Currently it shows only on elements that contain 'tooltip' class and is truncated.
   *
   * @param e MouseEvent - MouseOver event object
   */
  onFilterTooltip(e: MouseEvent) {
    const element = e.target as HTMLElement;

    if (element.classList.contains('tooltip') && this.isTruncated(element) && element.textContent) {
      this.tooltipDir.show(element.closest('td, th'));
    }
  }

  /**
   * This function check if component truncated.
   *
   * @param element - element to check
   */
  isTruncated(element: HTMLElement): boolean {
    const computed = getComputedStyle(element.parentElement);
    const parentWidth = element.parentElement.clientWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight);
    return parentWidth < element.offsetWidth;
  }

  /**
   * Getter for dropdowns with primitive type.
   * Get item from server by id and set in cache.
   */
  getDropdownItemById(id: string, column: IEditGridColumnSetting, field: string) {
    //generate unique key in scope of this grid
    const key = column.field + '_' + id;

    if (isNil(id)) {
      return null;
    }

    //check cache
    if (this.cache.items?.[key]) {
      return this.cache.items?.[key]?.[field];
    }
  }

  /**
   * Getter for dropdowns with primitive type.
   * Load item from server by id and set in cache.
   */
  loadDropdownItemById(id: string, column: IEditGridColumnSetting) {
    //generate unique key in scope of this grid
    const key = column.field + '_' + id;

    if (isNil(id)) {
      return of(null);
    }

    //check cache
    if (this.cache.items?.[key]) {
      return of(null);
    }

    //make api call
    return column.dropdownOptions.getOneItemFunction(id).pipe(
      takeUntil(this.onDestroy),
      tap(val => this.cache.items[key] = val)
    );
  }

  /**
   * Getter for selection options
   */
  getSelectionOptions(): SelectableSettings {
    return {
      enabled: this.isSelectable,
      checkboxOnly: this.allowMultiSelect,
      mode: this.allowMultiSelect ? 'multiple' : 'single'
    };
  }


  /**
   * initialize data views state
   */
  initDataViewState(): void {
    //init cache from bookmark or default values
    if (isNil(this.dataCacheName)) {
      this.dataCacheName = 'EditGridServerPagingComponent_DefaultCache';
    }

    this.cache = this.bookmarkService.getCurrentDataViewState(this.dataCacheName);

    if (isNil(this.cache.selectedRows)) {
      this.cache.selectedRows = [];
    }

    if (isNil(this.cache.isEditModeInProgress)) {
      this.cache.isEditModeInProgress = false;
    }

    if (isNil(this.cache.isNew)) {
      this.cache.isNew = false;
    }

    if (isNil(this.cache.editedRowIndex)) {
      this.cache.editedRowIndex = undefined;
    }

    if (isNil(this.cache.items)) {
      this.cache.items = {};
    }

    if (isNil(this.cache.changeItem)) {
      this.cache.changeItem = {};
    }

    if (!isNil(this.cache.validator) && !isNil(this.validator)) {
      this.validator.initValidatorResultStates(this.cache.validator);
    }

    //restore add or edit mode
    if (this.cache.isEditModeInProgress) {
      if (this.cache.isNew && this._parsedPermissionSettings.isAccessCreate) {
        this.grid?.addRow(this.cache.changeItem);
      } else if (!isNil(this.cache.editedRowIndex) && this._parsedPermissionSettings.isAccessUpdate) {
        this.grid?.editRow(this.cache.editedRowIndex);
      } else {
        this.cache.isNew = false;
        this.cache.editedRowIndex = null;
        this.cache.isEditModeInProgress = false;
      }
    }
  }

  /**
   * Init paging
   */
  initPaging(): void {
    // Configures the pager of the Grid
    this.pageableSettings = this.pageable;
    if (this.pageable) {
      this.pageableSettings = {
        buttonCount: 10,
        info: true,
        type: 'numeric',
        pageSizes: true,
        previousNext: true
      };
    }
  }

  /**
   * Method to close editor and clear editing cache
   */
  closeEditor(): void {
    this.changeStatus.emit(this.cache.isNew ? 'createClose' : 'updateClose');
    this.cache.isNew = false;
    this.cache.isEditModeInProgress = false;
    this.grid?.closeRow(this.cache.editedRowIndex);
    this.cache.editedRowIndex = undefined;
    this.cache.changeItem = {};
  }

  /**
   * Page change handler
   *
   * @param skip number - count of entities to skip
   * @param take number - page size
   */
  pageChange({skip, take}: PageChangeEvent): void {
    const page = (skip / take) + 1;

    //close editor on page change.
    if (page !== this.dataSource.page || this.dataSource.size !== take) {
      this.closeEditor();
    }

    //parse kendo SortDescriptor to our type
    const sort: PaginatorSort[] = this.grid.sort
      .filter(el => !!el.dir)
      .map(el => ({field: el.field, dir: el.dir}));

    this.pageChangeEvent.emit({
      skip,
      size: take,
      page: ((skip / take) + 1),
      sort
    });
  }

  /**
   * Sort change handler
   */
  onSortChange(e: SortDescriptor[]) {
    this.grid.sort = e;
    this.grid.sortable = this.sortable;
    this.goToPage(this.dataSource.page, this.dataSource.size);
  }

  /**
   * This method return sort direction of column or null
   */
  getSortDirection(field: string): 'asc' | 'desc' {
    const sortDesc = this.grid.sort.find(desc => desc.field === field);
    return sortDesc?.dir;
  }

  /**
   * Method to calculate new grid settings
   */
  renderGridView(): void {
    if (!isNil(this.dataSource)) {
      if (this.dataSource.responseList) {
        this.gridView = {
          data: this.dataSource.responseList,
          total: this.dataSource.totalElements
        };
        this.skip = this.dataSource.size * ((this.dataSource as IPaginator<any>).page - 1);
      }

      this.autoFit();
    }
  }

  /**
   * Method that called on 'link' or 'actionButton' cell click
   *
   * @param dataItem
   * @param column
   * @param isNew
   */
  cellClick(dataItem: any, column: IEditGridColumnSetting = null, isNew: boolean = null): void {
    if (!isEmpty(dataItem) && !isEmpty(column)) {
      dataItem.linkField = column?.field;
    }

    let isDisabled = false;

    if (!isNil(column)) {
      if (column.disabledIf && !isNil(isNew)) {
        isDisabled = column.disabledIf(dataItem, column, isNew);
      } else if (column.disabledField) {
        isDisabled = dataItem[column.disabledField];
      } else {
        isDisabled = !!column.isLinkDisabled;
      }
    }

    if (!isDisabled) {
      this.cellClickEvent.emit(dataItem);
    }
  }

  addHandler(event: AddEvent): void {
    this.autoFit();
    this.changeStatus.emit('createOpen');

    //reset validator
    this.validator?.resetValidationResults();

    //change mode to add new
    this.cache.isEditModeInProgress = true;
    this.cache.isNew = true;

    //init editing item with null fields
    this.cache.changeItem = {};
    this.columnSettings.forEach(el => {
      this.cache.changeItem[el.field] = null;
    });

    event.sender.addRow(this.cache.changeItem);
    this.validator?.setDto(this.cache.changeItem);

    this.editItemChange.emit({
      rowIndex: this.cache.editedRowIndex,
      isNew: this.cache.isNew,
      dataItem: this.cache.changeItem
    });
  }

  public editHandler({sender, rowIndex, dataItem}: EditEvent): void {
    this.autoFit();
    this.changeStatus.emit('updateOpen');

    //reset validator
    this.validator?.resetValidationResults();

    //change mode to edit
    this.cache.isEditModeInProgress = true;
    this.cache.isNew = false;
    this.cache.editedRowIndex = rowIndex;

    //init editing item
    this.cache.changeItem = {};
    this.columnSettings.forEach(el => {
      this.cache.changeItem[el.field] = dataItem[el.field];
    });

    this.validator?.setDto(this.cache.changeItem);

    sender.editRow(rowIndex);

    this.editItemChange.emit({
      rowIndex: this.cache.editedRowIndex,
      isNew: this.cache.isNew,
      dataItem: this.cache.changeItem
    });
  }

  /**
   * Cancel button handler
   *
   * @param e RemoveEvent
   */
  cancelHandler(e: CancelEvent): void {
    this.autoFit();
    this.closeEditor();
  }

  removeHandler(e: RemoveEvent): void {
    const removeEvent: EditGridRemoveEvent = {
      dataItem: e.dataItem,
      rowIndex: e.rowIndex,
      sender: e.sender,
      component: this
    };

    this.deleteActionEvent.emit({...removeEvent, successCallback: this.removeCallback.bind(removeEvent)});
  }

  /**
   * Callback after remove.
   *
   * @param success
   */
  removeCallback(success: boolean): void {
    const self = (this as EditGridRemoveEvent);
    const {dataSource} = self.component;

    if (success && self.component.isSelectable) {
      //decrement total elements and recalculate total pages
      dataSource.totalElements--;
      dataSource.totalPages = Math.ceil(dataSource.totalElements / dataSource.size);

      if (dataSource.responseList.length <= 0) {
        //reset selected rows in cache
        self.component.cache.selectedRows = [];
      } else {
        //find index to delete
        const deleteIndex = dataSource.responseList
          .findIndex(item => item[self.component.uniqueField] === self.dataItem[self.component.uniqueField]);

        //if we in single selection mode now then move selection after delete
        if (!self.component.allowMultiSelect) {
          if (deleteIndex < dataSource.responseList.length - 1) {
            if (self.component.selectionDataMode === 'id') {
              self.component.cache.selectedRows = [dataSource.responseList[deleteIndex + 1][self.component.uniqueField]];
            } else {
              self.component.cache.selectedRows = [dataSource.responseList[deleteIndex + 1]];
            }
          } else {
            if (deleteIndex > 0) {
              if (self.component.selectionDataMode === 'id') {
                self.component.cache.selectedRows = [dataSource.responseList[deleteIndex - 1][self.component.uniqueField]];
              } else {
                self.component.cache.selectedRows = [dataSource.responseList[deleteIndex - 1]];
              }
            } else {
              self.component.cache.selectedRows = [];
            }
          }
        } else {
          //delete selection in multiple mode
          self.component.cache.selectedRows = self.component.cache.selectedRows.filter(e =>
            self.component.selectionDataMode === 'id' ? e !== self.dataItem[self.component.uniqueField] : e !== self.dataItem);
        }

        //remove item from page
        dataSource.responseList.splice(deleteIndex, 1);

        //refetch page
        if (self.component.isRefreshOnDelete) {
          if (!dataSource.responseList.length && dataSource.totalPages > 1) {
            self.component.goToPage(dataSource.page - 1, dataSource.size);
          } else {
            self.component.goToPage(dataSource.page, dataSource.size);
          }
        }
      }
    }
  }

  /**
   * Callback that called after add new entity.
   *
   * @param success
   * @param updatedData
   */
  createCallback(success: boolean, updatedData: any): void {
    const self = (this as EditGridRemoveEvent);
    const {dataSource} = self.component;

    if (success) {
      if (self.component.isCloseEditorAfterAdd) {
        self.component.closeEditor();
      }

      self.component.columnSettings.forEach(el => {
        self.component.cache.changeItem[el.field] = el.type === 'dropdown'
        && !el.dropdownOptions.usePrimitiveForBinding ? {id: null} : null;
      });

      dataSource.totalElements++;

      if (!self.component.isRefreshOnCreate) {
        //add entity on top of page
        dataSource.responseList.unshift(updatedData);
        self.component.renderGridView();
      } else {
        //refetch page
        self.component.goToPage(dataSource.page, dataSource.size);
      }
    }
  }

  /**
   * Callback that called after update entity.
   *
   * @param success
   * @param updatedData
   */
  updateCallback(success: boolean, updatedData: any): void {
    const self = (this as EditGridRemoveEvent);
    const {uniqueField, dataSource} = self.component;

    if (success) {
      self.component.closeEditor();

      if (!self.component.isRefreshOnUpdate) {
        //replace row
        if (!isNil(uniqueField) && updatedData?.[uniqueField] && dataSource.responseList.length) {
          dataSource.responseList = dataSource.responseList.map(it => it[uniqueField] === updatedData[uniqueField] ? updatedData : it);
          self.component.renderGridView();
        }
      } else {
        self.component.goToPage(dataSource.page, dataSource.size);
      }
    }
  }

  saveHandler(e: SaveEvent): void {
    //validate data
    if (this.validator) {
      this.validator.setDto(this.cache.changeItem);
      this.validator.validateDto(this.cache.changeItem);
    }

    if (this.validator && !this.validator.dtoValidationResult.isValid) {
      //show errors
      this.customNotificationService.showDialogValidation(this.validator);
      this.changeStatus.emit('validationFailed');
      return;
    }

    if (e.isNew) {
      const createEvent: EditGridUpdateEvent = {
        dataItem: this.cache.changeItem,
        rowIndex: e.rowIndex,
        sender: e.sender,
        component: this
      };

      this.createActionEvent.emit({...createEvent, successCallback: this.createCallback.bind(createEvent)});
    } else {
      const editedItem = this.dataSource.responseList[this.cache.editedRowIndex % this.dataSource.size];
      const editEvent: EditGridUpdateEvent = {
        dataItem: {...editedItem, ...this.cache.changeItem},
        rowIndex: e.rowIndex,
        sender: e.sender,
        component: this
      };

      this.updateActionEvent.emit({...editEvent, successCallback: this.updateCallback.bind(editEvent)});
    }
  }

  /**
   * This method autofit columns
   */
  private autoFit() {
    setTimeout(() => {
      const cols = this.grid?.columns.toArray();

      if (!cols) {
        return;
      }

      if (this.autoFitColumns) {
        if (this.allowMultiSelect) {
          cols.shift();
        }

        if (this.allowUpdateAction || this.allowDeleteAction) {
          cols.pop();
        }

        if (this.hasSorter) {
          cols.pop();
        }

        this.grid.autoFitColumns(cols);
      } else {
        const columnIndexes = this.columnSettings
          .map((_, idx) => idx)
          .filter(colIndex => this.columnSettings[colIndex].autoFit)
          .map(colIndex => this.allowMultiSelect ? colIndex + 1 : colIndex);

        const fittedCols = columnIndexes.map(idx => cols[idx]);
        this.grid.autoFitColumns(fittedCols);
      }

      if (!this.autoFitColumns && !this.columnSettings.some(col => col.autoFit)) {
        return;
      }

      //change tables width (for items and header)
      this.grid.wrapper.nativeElement.querySelectorAll('table').forEach(table => {
        table.style.width = '100%';
      });

      //change columns width
      const tableColgroups = this.gridWrapper.nativeElement.querySelectorAll('.k-grid-table-wrap colgroup');

      if (tableColgroups.length) {
        this.calcCols([...tableColgroups[tableColgroups.length - 1].querySelectorAll('col')]);
        this.calcCols([...this.gridWrapper.nativeElement.querySelectorAll('.k-grid-header-wrap colgroup col')]);
      }
    }, 0);
  }

  /**
   * This method change cols width
   *
   * @param cols
   */
  calcCols(cols: Array<HTMLElement>) {
    //delete 'Select' column from fit
    if (this.allowMultiSelect) {
      cols.shift();
    }

    if (this.hasSorter) {
      const sorterCol = cols.pop();
      sorterCol.style.width = '90px';
      sorterCol.style.maxWidth = '90px';
    }

    if (this.allowUpdateAction || this.allowDeleteAction) {
      const actionCol = cols.pop();

      if (this.autoFitColumns) {
        actionCol.style.width = 'auto';
        actionCol.style.minWidth = '200px';
      } else {
        actionCol.style.width = '200px';
      }
    }

    //set columns width
    cols.forEach((col, index) => {
      const setting = this.columnSettings[index];

      if (!setting.autoFit && !setting.width && !this.autoFitColumns) {
        col.style.width = 'auto';
      } else if (setting.width) {
        col.style.width = setting.width + 'px';
      }
    });
  }

  inCellDataChange(columnField: string, newValue: any, dataItem: any) {
    dataItem[columnField] = newValue;
    this.inCellEditingChange.emit({dataItem, columnField, newValue});
  }

  onSelectionChange($event: SelectionEvent) {
    //not process selection change if grid not in selectable mode
    if (!this.isSelectable) {
      return;
    }

    //process deselecting of rows
    if (!isNil($event) && !isEmpty($event.deselectedRows)) {
      if (!this.allowMultiSelect && !isEmpty($event.deselectedRows[0])) {
        //set empty array on deselection in single selection mode
        this.cache.selectedRows = [];
      } else if (this.allowMultiSelect) {
        //get deselected uniqueFields and filter current selected rows
        // eslint-disable-next-line max-len
        const deselected = $event.deselectedRows.map(row => row.dataItem[this.uniqueField]);

        if (this.selectionDataMode === 'id') {
          this.cache.selectedRows = this.cache.selectedRows.filter(row => !deselected.includes(row));
        } else {
          this.cache.selectedRows = this.cache.selectedRows.filter(row => !deselected.includes(row[this.uniqueField]));
        }
      }
    }

    //process selecting of rows
    if (!isNil($event) && !isEmpty($event.selectedRows)) {
      if (!this.allowMultiSelect && !isEmpty($event.selectedRows[0])) {
        //set array from one value on selection in single selection mode
        if (this.selectionDataMode === 'id') {
          this.cache.selectedRows = [$event.selectedRows[0].dataItem[this.uniqueField]];
        } else {
          this.cache.selectedRows = [$event.selectedRows[0].dataItem];
        }
      } else if (this.allowMultiSelect) {
        //add selected rows to array
        this.cache.selectedRows = this.cache.selectedRows.concat($event.selectedRows.map(row =>
          this.selectionDataMode === 'id' ? row.dataItem[this.uniqueField] : row.dataItem));
      }
    }

    this.selectionChanged.emit(this.cache.selectedRows);
  }

  goToPage(page: number, size: number) {
    const skip = (page - 1) * size;
    this.pageChange({skip, take: size});
  }

  onValueChange() {
    this.editItemChange.emit({
      isNew: this.cache.isNew,
      dataItem: this.cache.changeItem,
      rowIndex: this.cache.editedRowIndex
    });
  }
}

interface SimpleGridDataViewStateCache {
  //uniqueField values of selected rows
  selectedRows?: Array<any>;
  //boolean that indicate inserting new item mode
  isNew?: boolean;
  //boolean that indicate editing mode
  isEditModeInProgress?: boolean;
  //row index of edited entity
  editedRowIndex?: number;
  //item object that currently adding or editing
  changeItem?: any;
  //cache for dropdowns that using primitive values
  items?: Record<string, any>;
  //validator
  validator?: Validator;
}

export interface InCellEditingChangeEvent<T = any, K extends keyof T = keyof T> {
  dataItem: T;
  columnField: K;
  newValue: T[K];
}

//interface with permissions
export interface EditGridPermissionSettingsConfig {
  isAccessRead?: boolean;
  isAccessCreate?: boolean;
  isAccessUpdate?: boolean;
  isAccessDelete?: boolean;
}
