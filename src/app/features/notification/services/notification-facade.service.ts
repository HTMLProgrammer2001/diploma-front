import {Injectable} from '@angular/core';
import {BookmarkService} from '../../../global/services/bookmark/bookmark.service';
import {NotificationApiService} from './notification-api.service';
import {NotificationMapperService} from './notification-mapper.service';
import {Observable, of, Subject} from 'rxjs';
import {INotificationConfigViewModel} from '../types/view-model/notification-config-view-model';
import {cloneDeep, isNil} from 'lodash';
import {map, tap} from 'rxjs/operators';
import {INotificationTeacherViewModel} from '../types/view-model/notification-teacher-view-model';
import {INotificationTypeViewModel} from '../types/view-model/notification-type-view-model';
import {NotificationTypesEnum} from '../types/common/notification-types.enum';
import {INotificationDayViewModel} from '../types/view-model/notification-day-view-model';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {ConfigService} from '../../../global/services/config/config.service';

@Injectable({providedIn: 'root'})
export class NotificationFacadeService {
  public refresh$ = new Subject();

  constructor(
    private bookmarkService: BookmarkService,
    private configService: ConfigService,
    private notificationMapperService: NotificationMapperService,
    private notificationApiService: NotificationApiService,
  ) {
  }

  //region Notification

  getNotificationConfig$(): Observable<INotificationConfigViewModel> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().notificationConfig)) {
      return of(this.bookmarkService.getCurrentDataItem().notificationConfig);
    } else {
      return this.loadNotificationConfig$();
    }
  }

  loadNotificationConfig$(): Observable<INotificationConfigViewModel> {
    return this.notificationApiService.getNotificationConfig$().pipe(
      map(resp => this.notificationMapperService.notificationConfigModelToViewModel(resp.data)),
      tap(resp => {
        this.bookmarkService.getCurrentDataItem().notificationConfig = resp;
        this.bookmarkService.getCurrentDataItem().notificationConfigCopy = cloneDeep(resp);
      })
    );
  }

  updateNotificationConfig$(viewModel: INotificationConfigViewModel): Observable<INotificationConfigViewModel> {
    const body = this.notificationMapperService.notificationConfigViewModelToUpdateModel(viewModel);
    return this.notificationApiService.updateNotificationConfig$(body).pipe(
      map(resp => this.notificationMapperService.notificationConfigModelToViewModel(resp.data)),
      tap(resp => {
        this.bookmarkService.getCurrentDataItem().notificationConfig = resp;
        this.bookmarkService.getCurrentDataItem().notificationConfigCopy = cloneDeep(resp);
      })
    );
  }

  getTeachersToNotify$(): Observable<Array<INotificationTeacherViewModel>> {
    if (!isNil(this.bookmarkService.getCurrentDataItem().teachersToNotify)) {
      return of(this.bookmarkService.getCurrentDataItem().teachersToNotify);
    } else {
      return this.loadTeachersToNotify$();
    }
  }

  loadTeachersToNotify$(): Observable<Array<INotificationTeacherViewModel>> {
    return this.notificationApiService.getTeachersToNotify$().pipe(
      map(resp => resp.data.map(el => this.notificationMapperService.notificationTeacherModelToViewModel(el))),
      tap(resp => this.bookmarkService.getCurrentDataItem().teachersToNotify = resp)
    );
  }

  triggerNotification$(): Observable<boolean> {
    return this.notificationApiService.triggerNotification$().pipe(map(resp => resp.data.result));
  }

  getNotificationTypes$(): Observable<Array<INotificationTypeViewModel>> {
    return of([
      {
        type: NotificationTypesEnum.MONTHLY,
        translateKey: 'NOTIFICATION.NOTIFY_TYPES.MONTHLY'
      },
      {
        type: NotificationTypesEnum.WEEKLY,
        translateKey: 'NOTIFICATION.NOTIFY_TYPES.WEEKLY'
      },
      {
        type: NotificationTypesEnum.DAILY,
        translateKey: 'NOTIFICATION.NOTIFY_TYPES.DAILY'
      }
    ]);
  }

  getNotificationWeekDays$(): Observable<Array<INotificationDayViewModel>> {
    return of([
      {
        day: 1,
        translateKey: 'COMMON.DAY_OF_WEEK.MONDAY'
      },
      {
        day: 2,
        translateKey: 'COMMON.DAY_OF_WEEK.TUESDAY'
      },
      {
        day: 3,
        translateKey: 'COMMON.DAY_OF_WEEK.WEDNESDAY'
      },
      {
        day: 4,
        translateKey: 'COMMON.DAY_OF_WEEK.THURSDAY'
      },
      {
        day: 5,
        translateKey: 'COMMON.DAY_OF_WEEK.FRIDAY'
      },
      {
        day: 6,
        translateKey: 'COMMON.DAY_OF_WEEK.SATURDAY'
      },
      {
        day: 7,
        translateKey: 'COMMON.DAY_OF_WEEK.SUNDAY'
      },
    ]);
  }

  getViewStateTeacherAttestationListPaginator$(): Observable<IPaginatorBase> {
    if (isNil(this.bookmarkService.getCurrentViewState().notificationTeachersPaginator)) {
      this.bookmarkService.getCurrentViewState().notificationTeachersPaginator = {
        page: this.configService.getConfig().pagingGridBigPage,
        size: this.configService.getConfig().pagingGridBigSize,
        sort: [{field: 'id', dir: 'asc'}]
      };
    }

    return of(this.bookmarkService.getCurrentViewState().notificationTeachersPaginator);
  }

  // endregion
}
