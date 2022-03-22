import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {EducationFacadeService} from '../../services/education-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IEducationListViewModel} from '../../types/view-model/education-list-view-model';
import {isEmpty} from 'lodash';
import {IEducationFilterViewModel} from '../../types/view-model/education-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-education-list',
  templateUrl: './view-education-list.component.html',
})
export class ViewEducationListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IEducationListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IEducationFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getEducationQualificationDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getEducationQualificationDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'EDUCATION.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'EDUCATION.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole),
      autoFit: true
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'EDUCATION.LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'educationQualification.name',
      titleTranslateKey: 'EDUCATION.LIST.GRID.EDUCATION_QUALIFICATION',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'institution',
      titleTranslateKey: 'EDUCATION.LIST.GRID.INSTITUTION',
      type: 'text',
    },
    {
      field: 'specialty',
      titleTranslateKey: 'EDUCATION.LIST.GRID.SPECIALTY',
      type: 'text',
    },
    {
      field: 'yearOfIssue',
      titleTranslateKey: 'EDUCATION.LIST.GRID.YEAR_OF_ISSUE',
      type: 'text',
      autoFit: true
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private educationFacadeService: EducationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.EDUCATION.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.EDUCATION.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.educationList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.educationFacadeService.getViewStateEducationFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.educationFacadeService.getTeacherDropdownList$.bind(this.educationFacadeService);
    this.getTeacherDropdownItem = this.educationFacadeService.getTeacherDropdownItem$.bind(this.educationFacadeService);

    this.getEducationQualificationDropdownList = this.educationFacadeService.getEducationQualificationDropdownList$
      .bind(this.educationFacadeService);

    this.getEducationQualificationDropdownItem = this.educationFacadeService.getEducationQualificationDropdownItem$
      .bind(this.educationFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.filter.institution = this.route.snapshot.queryParamMap.get('institution') || '';
    this.filter.specialty = this.route.snapshot.queryParamMap.get('specialty') || '';

    this.filter.yearOfIssueMore = this.route.snapshot.queryParamMap.get('yearOfIssueMore') ?
      Number(this.route.snapshot.queryParamMap.get('yearOfIssueMore')) : undefined;

    this.filter.yearOfIssueLess = this.route.snapshot.queryParamMap.get('yearOfIssueLess') ?
      Number(this.route.snapshot.queryParamMap.get('yearOfIssueLess')) : undefined;

    this.filter.educationQualificationId = this.route.snapshot.queryParamMap.get('educationQualificationId') ?
      Number(this.route.snapshot.queryParamMap.get('educationQualificationId')) : undefined;

    this.filter.teacherId = this.route.snapshot.queryParamMap.get('teacherId') ?
      Number(this.route.snapshot.queryParamMap.get('teacherId')) : undefined;

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
    const route = `/education/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.educationFacadeService.getViewStateEducationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.educationFacadeService.getEducationList$(this.paginator, this.filter);
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
    this.educationFacadeService.loadEducationList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IEducationListViewModel & { linkField: string }): Promise<boolean> {
    if (event.linkField === 'id') {
      const route = `education/details/${event.id}`;
      return this.router.navigate([route]);
    } else if (event.linkField === 'teacher.name') {
      const route = `teacher/details/${event.teacher?.id}`;
      return this.router.navigate([route]);
    } else {
      const route = `education-qualification/details/${event.educationQualification?.id}`;
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
