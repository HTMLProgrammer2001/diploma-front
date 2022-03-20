import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {IEducationQualificationViewModel} from '../../types/view-model/education-qualification-view-model';
import {IPaginator} from '../../../../shared/types/paginator';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {forkJoin, ReplaySubject} from 'rxjs';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {readRoles} from '../../../../shared/roles';
import {Router} from '@angular/router';
import {EducationQualificationFacadeService} from '../../services/education-qualification-facade.service';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {isEmpty} from 'lodash';
import {IEducationQualificationEducationViewModel} from '../../types/view-model/education-qualification-education-view-model';

@Component({
  selector: 'cr-education-qualification-educations-list',
  templateUrl: './education-qualification-educations-list.component.html',
})
export class EducationQualificationEducationsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() educationQualification: IEducationQualificationViewModel;

  public dataSource: IPaginator<IEducationQualificationEducationViewModel>;
  public paginator: IPaginatorBase;
  private onDestroy = new ReplaySubject(1);

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'id',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.EDUCATIONS_LIST.GRID.ID',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'teacher.name',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.EDUCATIONS_LIST.GRID.TEACHER',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'specialty',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.EDUCATIONS_LIST.GRID.SPECIALTY',
      type: 'text'
    },
    {
      field: 'institution',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.EDUCATIONS_LIST.GRID.INSTITUTION',
      type: 'text'
    },
    {
      field: 'yearOfIssue',
      titleTranslateKey: 'EDUCATION_QUALIFICATION.DETAILS.EDUCATIONS_LIST.GRID.YEAR_OF_ISSUE',
      type: 'text'
    },
  ];

  constructor(
    protected router: Router,
    private educationQualificationFacadeService: EducationQualificationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();

    this.educationQualificationFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.loadDataList());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.educationQualification && !changes.educationQualification.firstChange
      && changes.educationQualification.previousValue.id !== changes.educationQualification.currentValue.id) {
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
    forkJoin({
      paginator: this.educationQualificationFacadeService
        .getViewStateEducationQualificationEducationsListPaginator$()
    })
      .pipe(
        takeUntil(this.onDestroy),
        switchMap(values => {
          this.paginator = values.paginator;
          return this.educationQualificationFacadeService
            .getEducationQualificationEducationsList$(this.paginator, this.educationQualification);
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
    this.educationQualificationFacadeService
      .loadEducationQualificationEducationsList$(this.paginator, this.educationQualification)
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

  cellClick(event: IEducationQualificationEducationViewModel & { linkField: string }): Promise<boolean> {
    if (event.linkField === 'id') {
      const route = `education/details/${event.id}`;
      return this.router.navigate([route]);
    } else {
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
