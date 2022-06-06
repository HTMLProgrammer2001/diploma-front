import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {INotificationTeacherViewModel} from '../../types/view-model/notification-teacher-view-model';
import {NotificationFacadeService} from '../../services/notification-facade.service';
import {LocalPagingAdapter} from '../../../../shared/components/edit-grid-server-paging/local-paging-adapter';

@Component({
  selector: 'cr-teachers-to-notify-list',
  templateUrl: './teachers-to-notify-list.component.html',
  styleUrls: ['./teachers-to-notify-list.component.scss']
})
export class TeachersToNotifyListComponent implements OnInit, OnDestroy {
  public adapter: LocalPagingAdapter<INotificationTeacherViewModel> = new LocalPagingAdapter<INotificationTeacherViewModel>([]);
  public paginator: IPaginatorBase;
  private onDestroy = new ReplaySubject(1);

  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'teacherName',
      titleTranslateKey: 'NOTIFICATION.TEACHER_TO_NOTIFY_LIST.GRID.NAME',
      type: 'link',
      disabledIf: () => !readRoles.includes(this.authService.currentRole)
    },
    {
      field: 'teacherEmail',
      titleTranslateKey: 'NOTIFICATION.TEACHER_TO_NOTIFY_LIST.GRID.EMAIL',
      type: 'text'
    },
    {
      field: 'internshipHours',
      titleTranslateKey: 'NOTIFICATION.TEACHER_TO_NOTIFY_LIST.GRID.INTERNSHIP_HOURS_FROM_LAST_ATTESTATION',
      type: 'numeric'
    },
    {
      field: 'lastAttestationDate',
      titleTranslateKey: 'NOTIFICATION.TEACHER_TO_NOTIFY_LIST.GRID.LAST_ATTESTATION_DATE',
      type: 'date'
    },
    {
      field: 'nextAttestationDate',
      titleTranslateKey: 'NOTIFICATION.TEACHER_TO_NOTIFY_LIST.GRID.NEXT_ATTESTATION_DATE',
      type: 'date'
    },
  ];

  constructor(
    protected router: Router,
    private notificationFacadeService: NotificationFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();

    this.notificationFacadeService.refresh$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.loadDataList());
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // endregion

  // region Get and create data
  getDataList(): void {
    forkJoin({paginator: this.notificationFacadeService.getViewStateTeacherAttestationListPaginator$()}).pipe(
      takeUntil(this.onDestroy),
      switchMap(values => {
        this.paginator = values.paginator;
        return this.notificationFacadeService.getTeachersToNotify$();
      })
    ).subscribe(teachersToNotify => {
      this.adapter = new LocalPagingAdapter<INotificationTeacherViewModel>(teachersToNotify, this.paginator);
    }, error => {
      const errors = this.errorService.getMessagesToShow(error.errors);

      if (!isEmpty(errors)) {
        const errorDialog = this.customNotificationService.showDialogError(errors);
        errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
      }
    });
  }

  loadDataList() {
    this.paginator.page = 1;

    this.notificationFacadeService.loadTeachersToNotify$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(teachersToNotify => {
        this.adapter.setData(teachersToNotify);
        this.adapter.copyFromPaginator(this.paginator);
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

  cellClick(event: INotificationTeacherViewModel & {linkField: string}): Promise<boolean> {
    if(event.linkField === 'teacherId') {
      const route = `teacher/details/${event.teacherId}`;
      return this.router.navigate([route]);
    }
  }

  changePage(paginator: IPaginatorBase): void {
    this.paginator.page = paginator.page;
    this.paginator.size = paginator.size;
    this.paginator.sort = paginator.sort;
    this.adapter.copyFromPaginator(paginator);
  }

  //endregion
}
