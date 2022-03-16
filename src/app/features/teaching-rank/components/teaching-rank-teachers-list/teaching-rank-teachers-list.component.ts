import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ITeachingRankViewModel} from '../../types/view-model/teaching-rank-view-model';
import {IPaginator} from '../../../../shared/types/paginator';
import {ITeachingRankListViewModel} from '../../types/view-model/teaching-rank-list-view-model';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {forkJoin, ReplaySubject} from 'rxjs';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {readRoles} from '../../../../shared/roles';
import {Router} from '@angular/router';
import {TeachingRankFacadeService} from '../../services/teaching-rank-facade.service';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {isEmpty} from 'lodash';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-teaching-rank-teachers-list',
  templateUrl: './teaching-rank-teachers-list.component.html',
})
export class TeachingRankTeachersListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() teachingRank: ITeachingRankViewModel;

  public dataSource: IPaginator<IdNameSimpleItem>;
  public paginator: IPaginatorBase;
  private onDestroy = new ReplaySubject(1);

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'name',
      titleTranslateKey: 'TEACHING_RANK.DETAILS.TEACHERS_LIST.GRID.NAME',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
  ];

  constructor(
    protected router: Router,
    private teachingRankFacadeService: TeachingRankFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();

    this.teachingRankFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.loadDataList());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.teachingRank && !changes.teachingRank.firstChange
      && changes.teachingRank.previousValue.id !== changes.teachingRank.currentValue.id) {
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
    forkJoin({paginator: this.teachingRankFacadeService.getViewStateTeachingRankTeachersListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.teachingRankFacadeService.getTeachingRankTeachersList$(this.paginator, this.teachingRank);
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
    this.teachingRankFacadeService.loadTeachingRankTeachersList$(this.paginator, this.teachingRank).subscribe(value => {
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

  cellClick(event: ITeachingRankListViewModel): Promise<boolean> {
    const route = `teacher/details/${event.id}`;
    return this.router.navigate([route]);
  }

  changePage(paginator: IPaginatorBase): void {
    this.paginator.page = paginator.page;
    this.paginator.size = paginator.size;
    this.paginator.sort = paginator.sort;

    this.loadDataList();
  }

  //endregion
}
