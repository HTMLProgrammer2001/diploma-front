import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {ITeachingRankGetModel} from '../types/model/teaching-rank-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createTeachingRankQuery,
  deleteTeachingRankQuery,
  getTeachingRankByIdQuery,
  getTeachingRankListQuery,
  getTeachingRankTeachersListQuery,
  updateTeachingRankQuery
} from './teaching-rank-queries';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {ITeachingRankFilterModel} from '../types/model/teaching-rank-filter-model';
import {ITeachingRankPostModel} from '../types/model/teaching-rank-post-model';
import {ITeachingRankPutModel} from '../types/model/teaching-rank-put-model';
import {ITeachingRankTeachersFilterModel} from '../types/model/teaching-rank-teachers-filter-model';
import {ITeachingRankListGetModel} from '../types/model/teaching-rank-list-get-model';
import {TeachingRankOrderMap} from '../types/common/teaching-rank-order-map';

@Injectable({providedIn: 'root'})
export class TeachingRankApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getTeachingRankList$(paginator: IPaginatorBase, filter: ITeachingRankFilterModel):
    Observable<IResponse<IPaginator<ITeachingRankListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeachingRankListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: TeachingRankOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeachingRankList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeachingRankGetModel>>(config);
  }

  public getTeachingRank$(id: number): Observable<IResponse<ITeachingRankGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeachingRankByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeachingRankById'
    };

    return this.graphqlService.requestToApi<ITeachingRankGetModel>(config);
  }

  public createTeachingRank$(body: ITeachingRankPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createTeachingRankQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createTeachingRank'
    };

    return this.graphqlService.requestToApi<ITeachingRankGetModel>(config);
  }

  public updateTeachingRank$(body: ITeachingRankPutModel): Observable<IResponse<ITeachingRankGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateTeachingRankQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateTeachingRank'
    };

    return this.graphqlService.requestToApi<ITeachingRankGetModel>(config);
  }

  public deleteTeachingRank$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteTeachingRankQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteTeachingRank'
    };

    return this.graphqlService.requestToApi<ITeachingRankGetModel>(config);
  }

  public getTeachingRankTeachersList$(paginator: IPaginatorBase, filter: ITeachingRankTeachersFilterModel):
    Observable<IResponse<IPaginator<IdNameSimpleItem>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeachingRankTeachersListQuery,
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
