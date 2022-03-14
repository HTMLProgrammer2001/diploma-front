import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {Config} from '../../../global/types/config';
import {AuthService} from '../../../global/services/auth/auth.service';
import {ConfigService} from '../../../global/services/config/config.service';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {ICommissionGetModel} from '../types/model/commission-get-model';
import {ICommissionPostModel} from '../types/model/commission-post-model';
import {ICommissionPutModel} from '../types/model/commission-put-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createCommissionQuery,
  deleteCommissionQuery,
  getCommissionByIdQuery,
  getCommissionListQuery, getCommissionTeachersListQuery,
  updateCommissionQuery
} from './commission-queries';
import {ICommissionListGetModel} from '../types/model/commission-list-get-model';
import {ICommissionFilterModel} from '../types/model/commission-filter-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {ICommissionTeachersFilterModel} from '../types/model/commission-teachers-filter-model';

@Injectable({providedIn: 'root'})
export class CommissionApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getCommissionList$(paginator: IPaginatorBase, filter: ICommissionFilterModel):
    Observable<IResponse<IPaginator<ICommissionListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCommissionListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: paginator.sort?.[0].field ?? 'id',
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCommissionsList'
    };

    return this.graphqlService.requestToApi<IPaginator<ICommissionListGetModel>>(config);
  }

  public getCommission$(id: number): Observable<IResponse<ICommissionGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCommissionByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCommissionById'
    };

    return this.graphqlService.requestToApi<ICommissionGetModel>(config);
  }

  public createCommission$(body: ICommissionPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createCommissionQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createCommission'
    };

    return this.graphqlService.requestToApi<ICommissionGetModel>(config);
  }

  public updateCommission$(body: ICommissionPutModel): Observable<IResponse<ICommissionGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateCommissionQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateCommission'
    };

    return this.graphqlService.requestToApi<ICommissionGetModel>(config);
  }

  public deleteCommission$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteCommissionQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteCommission'
    };

    return this.graphqlService.requestToApi<ICommissionGetModel>(config);
  }

  public getCommissionTeachersList$(paginator: IPaginatorBase, filter: ICommissionTeachersFilterModel):
    Observable<IResponse<IPaginator<IdNameSimpleItem>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCommissionTeachersListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: 'fullName',
          isDesc: false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }
}
