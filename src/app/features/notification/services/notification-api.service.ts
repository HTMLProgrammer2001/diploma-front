import {Injectable} from '@angular/core';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {INotificationConfigModel} from '../types/model/notification-config-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {configurationRoles} from '../../../shared/roles';
import {
  getNotificationConfigQuery,
  getTeachersToNotifyQuery, triggerNotifyQuery,
  updateNotificationConfigQuery
} from './notification-queries';
import {INotificationUpdateModel} from '../types/model/notification-update-model';
import {INotificationTeacherModel} from '../types/model/notification-teacher-model';


@Injectable({providedIn: 'root'})
export class NotificationApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  getNotificationConfig$(): Observable<IResponse<INotificationConfigModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getNotificationConfigQuery,
      isPreloader: true,
      isAuthorize: true,
      roles: configurationRoles,
      resultField: 'getNotificationConfig'
    };

    return this.graphqlService.requestToApi<INotificationConfigModel>(config);
  }

  updateNotificationConfig$(body: INotificationUpdateModel): Observable<IResponse<INotificationConfigModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: updateNotificationConfigQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: configurationRoles,
      resultField: 'updateNotificationConfig'
    };

    return this.graphqlService.requestToApi<INotificationConfigModel>(config);
  }

  getTeachersToNotify$(): Observable<IResponse<Array<INotificationTeacherModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeachersToNotifyQuery,
      isPreloader: true,
      isAuthorize: true,
      roles: configurationRoles,
      resultField: 'getTeachersToNotify'
    };

    return this.graphqlService.requestToApi<Array<INotificationTeacherModel>>(config);
  }

  triggerNotification$(): Observable<IResponse<{result: boolean}>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: triggerNotifyQuery,
      isPreloader: true,
      isAuthorize: true,
      roles: configurationRoles,
      resultField: 'triggerNotification'
    };

    return this.graphqlService.requestToApi<{result: boolean}>(config);
  }
}
