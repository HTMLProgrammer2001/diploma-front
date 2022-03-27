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
import {cloneDeep, isEmpty, isNil} from 'lodash';
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
  private cacheInitialized: boolean;
  private onDestroy = new ReplaySubject(1);

  public getCommissionDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getCommissionDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getDepartmentDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getDepartmentDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getTeachingRankDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeachingRankDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getAcademicDegreeDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicDegreeDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getAcademicTitleDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicTitleDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

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
      field: 'commission.name',
      titleTranslateKey: 'TEACHER.LIST.GRID.COMMISSION',
      type: 'link',
    },
    {
      field: 'department.name',
      titleTranslateKey: 'TEACHER.LIST.GRID.DEPARTMENT',
      type: 'link',
    },
    {
      field: 'teacherRank.name',
      titleTranslateKey: 'TEACHER.LIST.GRID.TEACHING_RANK',
      type: 'link',
    },
    {
      field: 'academicTitle.name',
      titleTranslateKey: 'TEACHER.LIST.GRID.ACADEMIC_TITLE',
      type: 'link',
    },
    {
      field: 'academicDegree.name',
      titleTranslateKey: 'TEACHER.LIST.GRID.ACADEMIC_DEGREE',
      type: 'link',
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

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().teacherFilter);
    this.teacherFacadeService.getViewStateTeacherFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getCommissionDropdownList = this.teacherFacadeService.getCommissionDropdownList$.bind(this.teacherFacadeService);
    this.getCommissionDropdownItem = this.teacherFacadeService.getCommissionDropdownItem$.bind(this.teacherFacadeService);
    this.getDepartmentDropdownList = this.teacherFacadeService.getDepartmentDropdownList$.bind(this.teacherFacadeService);
    this.getDepartmentDropdownItem = this.teacherFacadeService.getDepartmentDropdownItem$.bind(this.teacherFacadeService);
    this.getTeachingRankDropdownList = this.teacherFacadeService.getTeachingRankDropdownList$.bind(this.teacherFacadeService);
    this.getTeachingRankDropdownItem = this.teacherFacadeService.getTeachingRankDropdownItem$.bind(this.teacherFacadeService);
    this.getAcademicDegreeDropdownList = this.teacherFacadeService.getAcademicDegreeDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicDegreeDropdownItem = this.teacherFacadeService.getAcademicDegreeDropdownItem$.bind(this.teacherFacadeService);
    this.getAcademicTitleDropdownList = this.teacherFacadeService.getAcademicTitleDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicTitleDropdownItem = this.teacherFacadeService.getAcademicTitleDropdownItem$.bind(this.teacherFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('fullName')) {
        this.filter.fullName = this.route.snapshot.queryParamMap.get('fullName');
      }

      if (this.route.snapshot.queryParamMap.get('email')) {
        this.filter.email = this.route.snapshot.queryParamMap.get('email');
      }

      if (this.route.snapshot.queryParamMap.get('commissionId')) {
        this.filter.commissionId = Number(this.route.snapshot.queryParamMap.get('commissionId'));
      }

      if (this.route.snapshot.queryParamMap.get('departmentId')) {
        this.filter.departmentId = Number(this.route.snapshot.queryParamMap.get('departmentId'));
      }

      if (this.route.snapshot.queryParamMap.get('teachingRankId')) {
        this.filter.teachingRankId = Number(this.route.snapshot.queryParamMap.get('teachingRankId'));
      }

      if (this.route.snapshot.queryParamMap.get('academicDegreeId')) {
        this.filter.academicDegreeId = Number(this.route.snapshot.queryParamMap.get('academicDegreeId'));
      }

      if (this.route.snapshot.queryParamMap.get('academicTitleId')) {
        this.filter.academicTitleId = Number(this.route.snapshot.queryParamMap.get('academicTitleId'));
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

  cellClick(event: ITeacherListViewModel & {linkField: string}): Promise<boolean> {
    if(event.linkField === 'id') {
      const route = `teacher/details/${event.id}`;
      return this.router.navigate([route]);
    }
    else if(event.linkField === 'commission.name') {
      const route = `commission/details/${event.commission.id}`;
      return this.router.navigate([route]);
    }
    else if(event.linkField === 'department.name') {
      const route = `department/details/${event.department.id}`;
      return this.router.navigate([route]);
    }
    else if(event.linkField === 'teacherRank.name') {
      const route = `teaching-rank/details/${event.teacherRank.id}`;
      return this.router.navigate([route]);
    }
    else if(event.linkField === 'academicDegree.name') {
      const route = `academic-degree/details/${event.academicDegree.id}`;
      return this.router.navigate([route]);
    }
    else {
      const route = `academic-title/details/${event.academicTitle.id}`;
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
