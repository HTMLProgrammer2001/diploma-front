import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IPublicationGetModel} from '../types/model/publication-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createPublicationQuery,
  deletePublicationQuery,
  getPublicationByIdQuery,
  getPublicationListQuery,
  getTeacherDropdownItemsQuery,
  getTeacherDropdownQuery,
  updatePublicationQuery
} from './publication-queries';
import {IPublicationFilterModel} from '../types/model/publication-filter-model';
import {IPublicationPostModel} from '../types/model/publication-post-model';
import {IPublicationPutModel} from '../types/model/publication-put-model';
import {IPublicationListGetModel} from '../types/model/publication-list-get-model';
import {PublicationOrderMap} from '../types/common/publication-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class PublicationApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getPublicationList$(paginator: IPaginatorBase, filter: IPublicationFilterModel):
    Observable<IResponse<IPaginator<IPublicationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getPublicationListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: PublicationOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getPublicationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IPublicationGetModel>>(config);
  }

  public getPublication$(id: number): Observable<IResponse<IPublicationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getPublicationByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getPublicationById'
    };

    return this.graphqlService.requestToApi<IPublicationGetModel>(config);
  }

  public createPublication$(body: IPublicationPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createPublicationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createPublication'
    };

    return this.graphqlService.requestToApi<IPublicationGetModel>(config);
  }

  public updatePublication$(body: IPublicationPutModel): Observable<IResponse<IPublicationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updatePublicationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updatePublication'
    };

    return this.graphqlService.requestToApi<IPublicationGetModel>(config);
  }

  public deletePublication$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deletePublicationQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deletePublication'
    };

    return this.graphqlService.requestToApi<IPublicationGetModel>(config);
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

  public getTeacherDropdownItems$(ids: Array<number>): Observable<IResponse<Array<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherDropdownItemsQuery,
      variables: {ids},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeachersByIds'
    };

    return this.graphqlService.requestToApi<Array<IdNameSimpleItem>>(config);
  }
}
