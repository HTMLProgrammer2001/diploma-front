import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {forkJoin, ReplaySubject} from 'rxjs';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {readRoles} from '../../../../shared/roles';
import {Router} from '@angular/router';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {isEmpty} from 'lodash';
import {TeacherFacadeService} from '../../services/teacher-facade.service';
import {ITeacherViewModel} from '../../types/view-model/teacher-view-model';
import {ITeacherAttestationListViewModel} from '../../types/view-model/teacher-attestation-list-view-model';
import {ITeacherEducationListViewModel} from '../../types/view-model/teacher-education-list-view-model';

@Component({
  selector: 'cr-teacher-educations-list',
  templateUrl: './teacher-educations-list.component.html',
})
export class TeacherEducationsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() teacher: ITeacherViewModel;

  public dataSource: IPaginator<ITeacherEducationListViewModel>;
  public paginator: IPaginatorBase;
  private onDestroy = new ReplaySubject(1);

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'TEACHER.DETAILS.EDUCATIONS_LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'educationQualification.name',
      titleTranslateKey: 'TEACHER.DETAILS.EDUCATIONS_LIST.GRID.EDUCATION_QUALIFICATION',
      type: 'link'
    },
    {
      field: 'institution',
      titleTranslateKey: 'TEACHER.DETAILS.EDUCATIONS_LIST.GRID.INSTITUTION',
      type: 'text'
    },
    {
      field: 'specialty',
      titleTranslateKey: 'TEACHER.DETAILS.EDUCATIONS_LIST.GRID.SPECIALTY',
      type: 'text'
    },
    {
      field: 'yearOfIssue',
      titleTranslateKey: 'TEACHER.DETAILS.EDUCATIONS_LIST.GRID.YEAR_OF_ISSUE',
      type: 'numeric'
    },
  ];

  constructor(
    protected router: Router,
    private teacherFacadeService: TeacherFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();

    this.teacherFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.loadDataList());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.teacher && !changes.teacher.firstChange
      && changes.teacher.previousValue.id !== changes.teacher.currentValue.id) {
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
    forkJoin({paginator: this.teacherFacadeService.getViewStateTeacherEducationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.teacherFacadeService.getTeacherEducationList$(this.paginator, this.teacher);
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
    this.teacherFacadeService.loadTeacherEducationList$(this.paginator, this.teacher)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(value => {
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

  cellClick(event: ITeacherEducationListViewModel & {linkField: string}): Promise<boolean> {
    if(event.linkField === 'id') {
      const route = `education/details/${event.id}`;
      return this.router.navigate([route]);
    }
    else {
      const route = `education-qualification/details/${event.educationQualification.id}`;
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
