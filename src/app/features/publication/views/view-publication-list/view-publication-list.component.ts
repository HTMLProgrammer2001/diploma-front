import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {PublicationFacadeService} from '../../services/publication-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IPublicationListViewModel} from '../../types/view-model/publication-list-view-model';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {IPublicationFilterViewModel} from '../../types/view-model/publication-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-publication-list',
  templateUrl: './view-publication-list.component.html',
})
export class ViewPublicationListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IPublicationListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IPublicationFilterViewModel;
  private cacheInitialized: boolean;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItems: (ids: Array<number>) => Observable<Array<IdNameSimpleItem>>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'PUBLICATION.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'PUBLICATION.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'title',
      titleTranslateKey: 'PUBLICATION.LIST.GRID.TITLE',
      type: 'text',
    },
    {
      field: 'authors',
      titleTranslateKey: 'PUBLICATION.LIST.GRID.AUTHORS',
      type: 'text',
    },
    {
      field: 'date',
      titleTranslateKey: 'PUBLICATION.LIST.GRID.DATE',
      type: 'date',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private publicationFacadeService: PublicationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.publicationList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initDropdowns();
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().publicationFilter);
    this.publicationFacadeService.getViewStatePublicationFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.publicationFacadeService.getTeacherDropdownList$.bind(this.publicationFacadeService);
    this.getTeacherDropdownItems = this.publicationFacadeService.getTeacherDropdownItems$.bind(this.publicationFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('title')) {
        this.filter.title = this.route.snapshot.queryParamMap.get('title');
      }

      if (this.route.snapshot.queryParamMap.get('dateMore')) {
        this.filter.dateMore = this.route.snapshot.queryParamMap.get('dateMore');
      }

      if (this.route.snapshot.queryParamMap.get('dateLess')) {
        this.filter.dateLess = this.route.snapshot.queryParamMap.get('dateLess');
      }

      if (this.route.snapshot.queryParamMap.getAll('teacherIds')) {
        this.filter.teacherIds = this.route.snapshot.queryParamMap.getAll('teacherIds').map(el => Number(el));
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
    const route = `/publication/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.publicationFacadeService.getViewStatePublicationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.publicationFacadeService.getPublicationList$(this.paginator, this.filter);
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
    this.publicationFacadeService.loadPublicationList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IPublicationListViewModel & { linkField: string }): Promise<boolean> {
    const route = `publication/details/${event.id}`;
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
