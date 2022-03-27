import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {RebukeFacadeService} from '../../services/rebuke-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IRebukeListViewModel} from '../../types/view-model/rebuke-list-view-model';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {IRebukeFilterViewModel} from '../../types/view-model/rebuke-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-rebuke-list',
  templateUrl: './view-rebuke-list.component.html',
})
export class ViewRebukeListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IRebukeListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IRebukeFilterViewModel;
  private cacheInitialized: boolean;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'REBUKE.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'REBUKE.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole),
      autoFit: true
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'REBUKE.LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'title',
      titleTranslateKey: 'REBUKE.LIST.GRID.TITLE_REBUKE',
      type: 'text',
    },
    {
      field: 'orderNumber',
      titleTranslateKey: 'REBUKE.LIST.GRID.ORDER_NUMBER',
      type: 'text',
    },
    {
      field: 'date',
      titleTranslateKey: 'REBUKE.LIST.GRID.DATE',
      type: 'date',
      autoFit: true,
    },
    {
      field: 'isActive',
      titleTranslateKey: 'REBUKE.LIST.GRID.IS_ACTIVE',
      type: 'boolean',
      autoFit: true,
      sortable: false,
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private rebukeFacadeService: RebukeFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.REBUKE.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.REBUKE.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.rebukeList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().rebukeFilter);
    this.rebukeFacadeService.getViewStateRebukeFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.rebukeFacadeService.getTeacherDropdownList$.bind(this.rebukeFacadeService);
    this.getTeacherDropdownItem = this.rebukeFacadeService.getTeacherDropdownItem$.bind(this.rebukeFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('title')) {
        this.filter.title = this.route.snapshot.queryParamMap.get('title');
      }

      if (this.route.snapshot.queryParamMap.get('orderNumber')) {
        this.filter.orderNumber = this.route.snapshot.queryParamMap.get('orderNumber');
      }

      if (this.route.snapshot.queryParamMap.get('dateMore')) {
        this.filter.dateMore = this.route.snapshot.queryParamMap.get('dateMore');
      }

      if (this.route.snapshot.queryParamMap.get('dateLess')) {
        this.filter.dateLess = this.route.snapshot.queryParamMap.get('dateLess');
      }

      if (this.route.snapshot.queryParamMap.get('teacherId')) {
        this.filter.teacherId = Number(this.route.snapshot.queryParamMap.get('teacherId'));
      }

      if (this.route.snapshot.queryParamMap.get('showInActive')) {
        this.filter.showInActive = this.route.snapshot.queryParamMap.get('showInActive') === 'true';
      }

      if (this.route.snapshot.queryParamMap.get('showDeleted')) {
        this.filter.showDeleted = this.route.snapshot.queryParamMap.get('showDeleted') === 'true';
      }
    }

    if (this.route.snapshot.queryParamMap.get('showDeleted') === 'true') {
      this.deletedColumn.hidden = !this.filter.showDeleted;
    }

    this.getDataList();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // endregion

  // region Get and create data
  createNewData(): Promise<boolean> {
    const route = `/rebuke/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.rebukeFacadeService.getViewStateRebukeListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.rebukeFacadeService.getRebukeList$(this.paginator, this.filter);
      })
    ).subscribe(dataSource => {
      this.dataSource = dataSource;
      this.paginator.page = dataSource.page;
      this.paginator.size = dataSource.size;
      this.refreshTitleHeaderButtons();
    }, error => {
      const errors = this.errorService.getMessagesToShow(error.errors);

      if (!isEmpty(errors)) {
        const errorDialog = this.customNotificationService.showDialogError(errors);
        errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
      }
    });
  }

  loadDataList() {
    this.rebukeFacadeService.loadRebukeList$(this.paginator, this.filter).subscribe(value => {
      this.dataSource = value;
      this.paginator.page = value.page;
      this.paginator.size = value.size;
      this.refreshTitleHeaderButtons();
    }, error => {
      const errors = this.errorService.getMessagesToShow(error.errors);

      if (!isEmpty(errors)) {
        const errorDialog = this.customNotificationService.showDialogError(errors);
        errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
      }
    });
  }

  // endregion

  //region Work with grid

  cellClick(event: IRebukeListViewModel & { linkField: string }): Promise<boolean> {
    if (event.linkField === 'id') {
      const route = `rebuke/details/${event.id}`;
      return this.router.navigate([route]);
    } else {
      const route = `teacher/details/${event.teacher?.id}`;
      return this.router.navigate([route]);
    }
  }

  changePage(paginator: IPaginatorBase): void {
    this.paginator.page = paginator.page;
    this.paginator.size = paginator.size;
    this.paginator.sort = paginator.sort;

    this.loadDataList();
  }

  onFilter() {
    this.deletedColumn.hidden = !this.filter.showDeleted;
    this.router.navigate([], {relativeTo: this.route, queryParams: this.filter, queryParamsHandling: 'merge'});
    this.bookmarkService.getCurrentBookmarkTask().params = cloneDeep(this.filter);
    this.loadDataList();
  }

  //endregion

  //region Title header

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('pin')
      .addElement('add')
      .setVisibility(false)
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  refreshTitleHeaderButtons(): void {
    this.titleHeaderButtonManager
      .getById('add')
      .setVisibility(writeRoles.includes(this.authService.currentRole));
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'add':
        this.createNewData();
        break;
    }
  }

  //endregion
}
