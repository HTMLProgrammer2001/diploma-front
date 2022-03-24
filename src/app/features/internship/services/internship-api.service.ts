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
import {IInternshipFilterModel} from '../types/model/internship-filter-model';
import {IInternshipPostModel} from '../types/model/internship-post-model';
import {IInternshipPutModel} from '../types/model/internship-put-model';
import {IInternshipListGetModel} from '../types/model/internship-list-get-model';
import {InternshipOrderMap} from '../types/common/internship-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class EducationApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getEducationList$(paginator: IPaginatorBase, filter: IInternshipFilterModel):
    Observable<IResponse<IPaginator<IInternshipListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationListQuery,
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
      resultField: 'getEducationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IInternshipGetModel>>(config);
  }

  public getEducation$(id: number): Observable<IResponse<IInternshipGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationById'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
  }

  public createEducation$(body: IInternshipPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createEducationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createEducation'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
  }

  public updateEducation$(body: IInternshipPutModel): Observable<IResponse<IInternshipGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateEducationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateEducation'
    };

    return this.graphqlService.requestToApi<IInternshipGetModel>(config);
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
