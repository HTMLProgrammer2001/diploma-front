import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ICategoryViewModel} from '../../types/view-model/category-view-model';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {forkJoin, ReplaySubject} from 'rxjs';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {readRoles} from '../../../../shared/roles';
import {Router} from '@angular/router';
import {CategoryFacadeService} from '../../services/category-facade.service';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {isEmpty} from 'lodash';
import {ICategoryAttestationViewModel} from '../../types/view-model/category-attestation-view-model';

@Component({
  selector: 'cr-category-attestations-list',
  templateUrl: './category-attestations-list.component.html',
})
export class CategoryAttestationsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() category: ICategoryViewModel;

  public dataSource: IPaginator<ICategoryAttestationViewModel>;
  public paginator: IPaginatorBase;
  private onDestroy = new ReplaySubject(1);

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'CATEGORY.DETAILS.ATTESTATIONS_LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'CATEGORY.DETAILS.ATTESTATIONS_LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'date',
      titleTranslateKey: 'CATEGORY.DETAILS.ATTESTATIONS_LIST.GRID.DATE',
      type: 'date',
    },
  ];

  constructor(
    protected router: Router,
    private categoryFacadeService: CategoryFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();

    this.categoryFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.loadDataList());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.category && !changes.category.firstChange
      && changes.category.previousValue.id !== changes.category.currentValue.id) {
      this.loadDataList();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // endregion

  // region Get and create data
  getDataList(): void {
    forkJoin({paginator: this.categoryFacadeService.getViewStateCategoryAttestationsListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.categoryFacadeService.getCategoryAttestationsList$(this.paginator, this.category);
      })
    ).subscribe(dataSource => {
      this.dataSource = dataSource;
      this.paginator.page = dataSource.page;
      this.paginator.size = dataSource.size;
    }, error => {
      const errors = this.errorService.getMessagesToShow(error.errors);

      if (!isEmpty(errors)) {
        const errorDialog = this.customNotificationService.showDialogError(errors);
        errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
      }
    });
  }

  loadDataList() {
    this.categoryFacadeService.loadCategoryAttestationsList$(this.paginator, this.category).subscribe(value => {
      this.dataSource = value;
      this.paginator.page = value.page;
      this.paginator.size = value.size;
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

  cellClick(event: ICategoryAttestationViewModel & {linkField: string}): Promise<boolean> {
    if(event.linkField === 'id') {
      const route = `attestation/details/${event.id}`;
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

  //endregion
}
