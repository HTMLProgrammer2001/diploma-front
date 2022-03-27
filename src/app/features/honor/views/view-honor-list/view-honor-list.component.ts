import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {HonorFacadeService} from '../../services/honor-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IHonorListViewModel} from '../../types/view-model/honor-list-view-model';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {IHonorFilterViewModel} from '../../types/view-model/honor-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-honor-list',
  templateUrl: './view-honor-list.component.html',
})
export class ViewHonorListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IHonorListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IHonorFilterViewModel;
  private cacheInitialized: boolean;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'HONOR.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'HONOR.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole),
      autoFit: true
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'HONOR.LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'title',
      titleTranslateKey: 'HONOR.LIST.GRID.TITLE_HONOR',
      type: 'text',
    },
    {
      field: 'orderNumber',
      titleTranslateKey: 'HONOR.LIST.GRID.ORDER_NUMBER',
      type: 'text',
    },
    {
      field: 'date',
      titleTranslateKey: 'HONOR.LIST.GRID.DATE',
      type: 'date',
      autoFit: true,
    },
    {
      field: 'isActive',
      titleTranslateKey: 'HONOR.LIST.GRID.IS_ACTIVE',
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
    private honorFacadeService: HonorFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.HONOR.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.HONOR.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.honorList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().honorFilter);
    this.honorFacadeService.getViewStateHonorFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.honorFacadeService.getTeacherDropdownList$.bind(this.honorFacadeService);
    this.getTeacherDropdownItem = this.honorFacadeService.getTeacherDropdownItem$.bind(this.honorFacadeService);
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
    const route = `/honor/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.honorFacadeService.getViewStateHonorListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.honorFacadeService.getHonorList$(this.paginator, this.filter);
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
    this.honorFacadeService.loadHonorList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IHonorListViewModel & { linkField: string }): Promise<boolean> {
    if (event.linkField === 'id') {
      const route = `honor/details/${event.id}`;
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
