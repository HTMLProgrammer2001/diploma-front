import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {TeacherFacadeService} from '../../services/teacher-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {ITeacherListViewModel} from '../../types/view-model/teacher-list-view-model';
import {isEmpty} from 'lodash';
import {ITeacherFilterViewModel} from '../../types/view-model/teacher-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-teacher-list',
  templateUrl: './view-teacher-list.component.html',
})
export class ViewTeacherListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<ITeacherListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: ITeacherFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  public getCommissionDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getDepartmentDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeachingRankDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicDegreeDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicTitleDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'TEACHER.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'TEACHER.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'name',
      titleTranslateKey: 'TEACHER.LIST.GRID.NAME',
      type: 'text',
    },
    {
      field: 'email',
      titleTranslateKey: 'TEACHER.LIST.GRID.EMAIL',
      type: 'text',
    },
    {
      field: 'commission',
      titleTranslateKey: 'TEACHER.LIST.GRID.COMMISSION',
      type: 'text',
    },
    {
      field: 'department',
      titleTranslateKey: 'TEACHER.LIST.GRID.DEPARTMENT',
      type: 'text',
    },
    {
      field: 'teacherRank',
      titleTranslateKey: 'TEACHER.LIST.GRID.TEACHING_RANK',
      type: 'text',
    },
    {
      field: 'academicTitle',
      titleTranslateKey: 'TEACHER.LIST.GRID.ACADEMIC_TITLE',
      type: 'text',
    },
    {
      field: 'academicDegree',
      titleTranslateKey: 'TEACHER.LIST.GRID.ACADEMIC_DEGREE',
      type: 'text',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private teacherFacadeService: TeacherFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.TEACHER.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.TEACHER.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.teacherList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.teacherFacadeService.getViewStateTeacherFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getCommissionDropdownList = this.teacherFacadeService.getCommissionDropdownList$.bind(this.teacherFacadeService);
    this.getDepartmentDropdownList = this.teacherFacadeService.getDepartmentDropdownList$.bind(this.teacherFacadeService);
    this.getTeachingRankDropdownList = this.teacherFacadeService.getTeachingRankDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicDegreeDropdownList = this.teacherFacadeService.getAcademicDegreeDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicTitleDropdownList = this.teacherFacadeService.getAcademicTitleDropdownList$.bind(this.teacherFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.filter.fullName = this.route.snapshot.queryParamMap.get('name') || '';
    this.filter.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.filter.showDeleted = this.route.snapshot.queryParamMap.get('showDeleted') === 'true' || false;

    this.filter.commissionId = this.route.snapshot.queryParamMap.get('commissionId') ?
      Number(this.route.snapshot.queryParamMap.get('commissionId')) : undefined;

    this.filter.departmentId = this.route.snapshot.queryParamMap.get('departmentId') ?
      Number(this.route.snapshot.queryParamMap.get('departmentId')) : undefined;

    this.filter.teachingRankId = this.route.snapshot.queryParamMap.get('teachingRankId') ?
      Number(this.route.snapshot.queryParamMap.get('teachingRankId')) : undefined;

    this.filter.academicTitleId = this.route.snapshot.queryParamMap.get('academicTitleId') ?
      Number(this.route.snapshot.queryParamMap.get('academicTitleId')) : undefined;

    this.filter.academicDegreeId = this.route.snapshot.queryParamMap.get('academicDegreeId') ?
      Number(this.route.snapshot.queryParamMap.get('academicDegreeId')) : undefined;

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
    const route = `/teacher/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.teacherFacadeService.getViewStateTeacherListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.teacherFacadeService.getTeacherList$(this.paginator, this.filter);
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
    this.teacherFacadeService.loadTeacherList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: ITeacherListViewModel): Promise<boolean> {
    const route = `teacher/details/${event.id}`;
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
