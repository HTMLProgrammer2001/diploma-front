import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IHonorGetModel} from '../types/model/honor-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createHonorQuery,
  deleteHonorQuery,
  getHonorByIdQuery,
  getHonorListQuery,
  getTeacherDropdownItemQuery,
  getTeacherDropdownQuery,
  updateHonorQuery
} from './honor-queries';
import {IHonorFilterModel} from '../types/model/honor-filter-model';
import {IHonorPostModel} from '../types/model/honor-post-model';
import {IHonorPutModel} from '../types/model/honor-put-model';
import {IHonorListGetModel} from '../types/model/honor-list-get-model';
import {HonorOrderMap} from '../types/common/honor-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class HonorApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getHonorList$(paginator: IPaginatorBase, filter: IHonorFilterModel):
    Observable<IResponse<IPaginator<IHonorListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getHonorListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: HonorOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getHonorList'
    };

    return this.graphqlService.requestToApi<IPaginator<IHonorGetModel>>(config);
  }

  public getHonor$(id: number): Observable<IResponse<IHonorGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getHonorByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getHonorById'
    };

    return this.graphqlService.requestToApi<IHonorGetModel>(config);
  }

  public createHonor$(body: IHonorPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createHonorQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createHonor'
    };

    return this.graphqlService.requestToApi<IHonorGetModel>(config);
  }

  public updateHonor$(body: IHonorPutModel): Observable<IResponse<IHonorGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateHonorQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateHonor'
    };

    return this.graphqlService.requestToApi<IHonorGetModel>(config);
  }

  public deleteHonor$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteHonorQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteHonor'
    };

    return this.graphqlService.requestToApi<IHonorGetModel>(config);
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
