import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IInternshipGetModel} from '../types/model/internship-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createInternshipQuery,
  deleteInternshipQuery,
  getInternshipByIdQuery,
  getInternshipListQuery,
  getTeacherDropdownItemQuery,
  getTeacherDropdownQuery,
  updateInternshipQuery
} from './internship-queries';
import {IInternshipFilterModel} from '../types/model/internship-filter-model';
import {IInternshipPostModel} from '../types/model/internship-post-model';
import {IInternshipPutModel} from '../types/model/internship-put-model';
import {IInternshipListGetModel} from '../types/model/internship-list-get-model';
import {InternshipOrderMap} from '../types/common/internship-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class InternshipApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getInternshipList$(paginator: IPaginatorBase, filter: IInternshipFilterModel):
    Observable<IResponse<IPaginator<IInternshipListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getInternshipListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: InternshipOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getInternshipList'
    };

    return this.graphqlService.requestToApi<IPaginator<IInternshipListGetModel>>(config);
  }

  public getInternship$(id: number): Observable<IResponse<IInternshipGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getInternshipByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getInternshipById'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
  }

  public createInternship$(body: IInternshipPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createInternshipQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createInternship'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
  }

  public updateInternship$(body: IInternshipPutModel): Observable<IResponse<IInternshipGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateInternshipQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateInternship'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
  }

  public deleteInternship$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteInternshipQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteInternship'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
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
