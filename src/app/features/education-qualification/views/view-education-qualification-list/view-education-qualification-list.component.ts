import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {EducationQualificationFacadeService} from '../../services/education-qualification-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IEducationQualificationListViewModel} from '../../types/view-model/education-qualification-list-view-model';
import {isEmpty} from 'lodash';
import {IEducationQualificationFilterViewModel} from '../../types/view-model/education-qualification-filter-view-model';

@Component({
  selector: 'cr-view-education-qualification-list',
  templateUrl: './view-education-qualification-list.component.html',
})
export class ViewEducationQualificationListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IEducationQualificationListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IEducationQualificationFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'EDUCATION_QUALIFICATION.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'name',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.LIST.GRID.NAME',
      type: 'text',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private educationQualificationFacadeService: EducationQualificationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.EDUCATION_QUALIFICATION.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.EDUCATION_QUALIFICATION.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.educationQualificationList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();

    this.educationQualificationFacadeService.getViewStateEducationQualificationFilter$()
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
    const route = `/education-qualification/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.educationQualificationFacadeService.getViewStateEducationQualificationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.educationQualificationFacadeService.getEducationQualificationList$(this.paginator, this.filter);
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
    this.educationQualificationFacadeService.loadEducationQualificationList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IEducationQualificationListViewModel): Promise<boolean> {
    const route = `education-qualification/details/${event.id}`;
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
