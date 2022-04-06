import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {UserFacadeService} from '../../services/user-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IUserListViewModel} from '../../types/view-model/user-list-view-model';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {IUserFilterViewModel} from '../../types/view-model/user-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-user-list',
  templateUrl: './view-user-list.component.html',
})
export class ViewUserListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IUserListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IUserFilterViewModel;
  private cacheInitialized: boolean;
  private onDestroy = new ReplaySubject(1);

  public getRoleDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getRoleDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'USER.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'USER.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'fullName',
      titleTranslateKey: 'USER.LIST.GRID.NAME',
      type: 'text',
    },
    {
      field: 'email',
      titleTranslateKey: 'USER.LIST.GRID.EMAIL',
      type: 'text',
    },
    {
      field: 'role.name',
      titleTranslateKey: 'USER.LIST.GRID.ROLE',
      type: 'text',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private userFacadeService: UserFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.USER.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.USER.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.userList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().categoryFilter);
    this.userFacadeService.getViewStateUserFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getRoleDropdownList = this.userFacadeService.getRoleDropdownList$.bind(this.userFacadeService);
    this.getRoleDropdownItem = this.userFacadeService.getRoleDropdownItem$.bind(this.userFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('fullName')) {
        this.filter.fullName = this.route.snapshot.queryParamMap.get('name');
      }

      if (this.route.snapshot.queryParamMap.get('email')) {
        this.filter.email = this.route.snapshot.queryParamMap.get('email');
      }

      if (this.route.snapshot.queryParamMap.get('roleId')) {
        this.filter.roleId = Number(this.route.snapshot.queryParamMap.get('roleId'));
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
    const route = `/user/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.userFacadeService.getViewStateUserListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.userFacadeService.getUserList$(this.paginator, this.filter);
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
    this.userFacadeService.loadUserList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IUserListViewModel): Promise<boolean> {
    const route = `user/details/${event.id}`;
    return this.router.navigate([route]);
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
