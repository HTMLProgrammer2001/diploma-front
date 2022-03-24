import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {InternshipFacadeService} from '../../services/internship-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IInternshipListViewModel} from '../../types/view-model/internship-list-view-model';
import {isEmpty} from 'lodash';
import {IInternshipFilterViewModel} from '../../types/view-model/internship-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-internship-list',
  templateUrl: './view-internship-list.component.html',
})
export class ViewInternshipListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IInternshipListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IInternshipFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'INTERNSHIP.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole),
      autoFit: true
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'code',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.CODE',
      type: 'text',
    },
    {
      field: 'title',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.TITLE_GRID',
      type: 'text',
    },
    {
      field: 'from',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.FROM',
      type: 'date',
    },
    {
      field: 'to',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.TO',
      type: 'date',
    },
    {
      field: 'hours',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.HOURS',
      type: 'numeric',
    },
    {
      field: 'place',
      titleTranslateKey: 'INTERNSHIP.LIST.GRID.PLACE',
      type: 'text',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private internshipFacadeService: InternshipFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.INTERNSHIP.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.INTERNSHIP.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.internshipList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
    this.initDropdowns();

    this.internshipFacadeService.getViewStateInternshipFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.internshipFacadeService.getTeacherDropdownList$.bind(this.internshipFacadeService);
    this.getTeacherDropdownItem = this.internshipFacadeService.getTeacherDropdownItem$.bind(this.internshipFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.filter.title = this.route.snapshot.queryParamMap.get('title') || '';
    this.filter.place = this.route.snapshot.queryParamMap.get('place') || '';
    this.filter.dateFromMore = this.route.snapshot.queryParamMap.get('dateFromMore') || '';
    this.filter.dateToLess = this.route.snapshot.queryParamMap.get('dateToLess') || '';
    this.filter.code = this.route.snapshot.queryParamMap.get('code') || '';
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
    const route = `/internship/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.internshipFacadeService.getViewStateInternshipListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.internshipFacadeService.getInternshipList$(this.paginator, this.filter);
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
    this.internshipFacadeService.loadInternshipList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IInternshipListViewModel & { linkField: string }): Promise<boolean> {
    if (event.linkField === 'id') {
      const route = `internship/details/${event.id}`;
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
