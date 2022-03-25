import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {AttestationFacadeService} from '../../services/attestation-facade.service';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {switchMap, takeUntil} from 'rxjs/operators';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IAttestationListViewModel} from '../../types/view-model/attestation-list-view-model';
import {isEmpty} from 'lodash';
import {IAttestationFilterViewModel} from '../../types/view-model/attestation-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-attestation-list',
  templateUrl: './view-attestation-list.component.html',
})
export class ViewAttestationListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public dataSource: IPaginator<IAttestationListViewModel>;
  public paginator: IPaginatorBase;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public filter: IAttestationFilterViewModel;
  private onDestroy = new ReplaySubject(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getCategoryDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getCategoryDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  private deletedColumn: IEditGridColumnSetting = {
    field: 'isDeleted',
    titleTranslateKey: 'ATTESTATION.LIST.GRID.DELETED',
    type: 'boolean',
    autoFit: true,
    hidden: true,
    sortable: false
  };

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'ATTESTATION.LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'ATTESTATION.LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'category.name',
      titleTranslateKey: 'ATTESTATION.LIST.GRID.CATEGORY',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'date',
      titleTranslateKey: 'ATTESTATION.LIST.GRID.DATE',
      type: 'date',
    },
    this.deletedColumn,
  ];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private attestationFacadeService: AttestationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ATTESTATION.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ATTESTATION.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.attestationList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initDropdowns();
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();

    this.attestationFacadeService.getViewStateAttestationFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => this.filter = filter);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.attestationFacadeService.getTeacherDropdownList$.bind(this.attestationFacadeService);
    this.getTeacherDropdownItem = this.attestationFacadeService.getTeacherDropdownItem$.bind(this.attestationFacadeService);
    this.getCategoryDropdownList = this.attestationFacadeService.getCategoryDropdownList$.bind(this.attestationFacadeService);
    this.getCategoryDropdownItem = this.attestationFacadeService.getCategoryDropdownItem$.bind(this.attestationFacadeService);
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.filter.teacherId = this.route.snapshot.queryParamMap.get('teacherId') ?
      Number(this.route.snapshot.queryParamMap.get('teacherId')) : undefined;
    this.filter.categoryId = this.route.snapshot.queryParamMap.get('categoryId') ?
      Number(this.route.snapshot.queryParamMap.get('categoryId')) : undefined;
    this.filter.dateMore = this.route.snapshot.queryParamMap.get('dateMore') || '';
    this.filter.dateLess = this.route.snapshot.queryParamMap.get('dateLess') || '';
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
    const route = `/attestation/new`;
    return this.router.navigate([route]);
  }

  getDataList(): void {
    forkJoin({paginator: this.attestationFacadeService.getViewStateAttestationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.attestationFacadeService.getAttestationList$(this.paginator, this.filter);
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
    this.attestationFacadeService.loadAttestationList$(this.paginator, this.filter).subscribe(value => {
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

  cellClick(event: IAttestationListViewModel & {linkField: string}): Promise<boolean> {
    if(event.linkField === 'id') {
      const route = `attestation/details/${event.id}`;
      return this.router.navigate([route]);
    }
    else if(event.linkField === 'category.name') {
      const route = `category/details/${event.category.id}`;
      return this.router.navigate([route]);
    }
    else {
      const route = `teacher/details/${event.teacher.id}`;
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
