import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IRebukeGetModel} from '../types/model/rebuke-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createRebukeQuery,
  deleteRebukeQuery,
  getRebukeByIdQuery,
  getRebukeListQuery,
  getTeacherDropdownItemQuery,
  getTeacherDropdownQuery,
  updateRebukeQuery
} from './rebuke-queries';
import {IRebukeFilterModel} from '../types/model/rebuke-filter-model';
import {IRebukePostModel} from '../types/model/rebuke-post-model';
import {IRebukePutModel} from '../types/model/rebuke-put-model';
import {IRebukeListGetModel} from '../types/model/rebuke-list-get-model';
import {RebukeOrderMap} from '../types/common/rebuke-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class RebukeApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getRebukeList$(paginator: IPaginatorBase, filter: IRebukeFilterModel):
    Observable<IResponse<IPaginator<IRebukeListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getRebukeListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: RebukeOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getRebukeList'
    };

    return this.graphqlService.requestToApi<IPaginator<IRebukeGetModel>>(config);
  }

  public getRebuke$(id: number): Observable<IResponse<IRebukeGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getRebukeByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getRebukeById'
    };

    return this.graphqlService.requestToApi<IRebukeGetModel>(config);
  }

  public createRebuke$(body: IRebukePostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createRebukeQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createRebuke'
    };

    return this.graphqlService.requestToApi<IRebukeGetModel>(config);
  }

  public updateRebuke$(body: IRebukePutModel): Observable<IResponse<IRebukeGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateRebukeQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateRebuke'
    };

    return this.graphqlService.requestToApi<IRebukeGetModel>(config);
  }

  public deleteRebuke$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteRebukeQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteRebuke'
    };

    return this.graphqlService.requestToApi<IRebukeGetModel>(config);
  }

  public getTeacherDropdown$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherDropdownQuery,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getTeacherDropdownItem$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }
}
