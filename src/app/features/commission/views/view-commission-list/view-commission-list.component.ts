import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {CommissionFacadeService} from '../../services/commission-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {ICommissionListViewModel} from '../../types/view-model/commission-list-view-model';
import {isEmpty} from 'lodash';
import {ICommissionFilterViewModel} from '../../types/view-model/commission-filter-view-model';

@Component({
  selector: 'cr-view-commission-list',
  templateUrl: './view-commission-list.component.html',
})
export class ViewCommissionListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<ICommissionListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: ICommissionFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'COMMISSION.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'COMMISSION.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'name',
      titleTranslateKey: 'COMMISSION.LIST.GRID.NAME',
      type: 'text',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private commissionFacadeService: CommissionFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.COMMISSION.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.COMMISSION.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.commissionList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();

    this.commissionFacadeService.getViewStateCommissionFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.filter.name = this.route.snapshot.queryParamMap.get('name') || '';
    this.filter.showDeleted = this.route.snapshot.queryParamMap.get('showDeleted') === 'true' || false;
    this.deletedColumn.hidden = !this.filter.showDeleted;

    this.getDataList();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // endregion

  // region Get and create data
  createNewData(): Promise<boolean> {
    const route = `/commission/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.commissionFacadeService.getViewStateCommissionListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.commissionFacadeService.getCommissionList$(this.paginator, this.filter);
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
    this.commissionFacadeService.loadCommissionList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: ICommissionListViewModel): Promise<boolean> {
    const route = `commission/details/${event.id}`;
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
    this.bookmarkService.getCurrentBookmarkTask().params = this.filter;
    this.loadDataList();
  }

  //endregion

  //region Title header

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
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
