import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IEducationGetModel} from '../types/model/education-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createEducationQuery,
  deleteEducationQuery,
  getEducationByIdQuery,
  getEducationListQuery,
  getEducationQualificationDropdownItemQuery,
  getEducationQualificationDropdownQuery,
  getTeacherDropdownItemQuery,
  getTeacherDropdownQuery,
  updateEducationQuery
} from './education-queries';
import {IEducationFilterModel} from '../types/model/education-filter-model';
import {IEducationPostModel} from '../types/model/education-post-model';
import {IEducationPutModel} from '../types/model/education-put-model';
import {IEducationListGetModel} from '../types/model/education-list-get-model';
import {EducationOrderMap} from '../types/common/education-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class EducationApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getEducationList$(paginator: IPaginatorBase, filter: IEducationFilterModel):
    Observable<IResponse<IPaginator<IEducationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: EducationOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IEducationGetModel>>(config);
  }

  public getEducation$(id: number): Observable<IResponse<IEducationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationById'
    };

    return this.graphqlService.requestToApi<IEducationGetModel>(config);
  }

  public createEducation$(body: IEducationPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createEducationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createEducation'
    };

    return this.graphqlService.requestToApi<IEducationGetModel>(config);
  }

  public updateEducation$(body: IEducationPutModel): Observable<IResponse<IEducationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateEducationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateEducation'
    };

    return this.graphqlService.requestToApi<IEducationGetModel>(config);
  }

  public deleteEducation$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteEducationQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteEducation'
    };

    return this.graphqlService.requestToApi<IEducationGetModel>(config);
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

  public getEducationQualificationDropdown$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationQualificationDropdownQuery,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationQualificationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getEducationQualificationDropdownItem$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationQualificationDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationQualificationById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }
}
