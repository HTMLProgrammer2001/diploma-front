import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {ITeacherGetModel} from '../types/model/teacher-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createTeacherQuery,
  deleteTeacherQuery,
  getAcademicDegreeDropdown,
  getAcademicTitleDropdown,
  getCommissionDropdown,
  getDepartmentDropdown,
  getTeacherAttestationList,
  getTeacherByIdQuery, getTeacherEducationList, getTeacherHonorList, getTeacherInternshipList,
  getTeacherListQuery, getTeacherPublicationList, getTeacherRebukeList,
  getTeachingRankDropdown,
  updateTeacherQuery
} from './teacher-queries';
import {ITeacherFilterModel} from '../types/model/teacher-filter-model';
import {ITeacherPostModel} from '../types/model/teacher-post-model';
import {ITeacherPutModel} from '../types/model/teacher-put-model';
import {ITeacherListGetModel} from '../types/model/teacher-list-get-model';
import {TeacherOrderMap} from '../types/common/teacher-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {ITeacherAttestationListGetModel} from '../types/model/teacher-attestation-list-get-model';
import {ICommonTeacherDataFilterGetModel} from '../types/model/common-teacher-data-filter-get-model';
import {ITeacherRebukeListGetModel} from '../types/model/teacher-rebuke-list-get-model';
import {ITeacherHonorListGetModel} from '../types/model/teacher-honor-list-get-model';
import {ITeacherInternshipListGetModel} from '../types/model/teacher-internship-list-get-model';
import {ITeacherEducationListGetModel} from '../types/model/teacher-education-list-get-model';
import {ITeacherPublicationListGetModel} from '../types/model/teacher-publication-list-get-model';
import {ITeacherInternshipListResponseModel} from '../types/model/teacher-internship-list-response-model';
import {ITeacherAttestationListResponseModel} from '../types/model/teacher-attestation-list-response-model';

@Injectable({providedIn: 'root'})
export class TeacherApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getTeacherList$(paginator: IPaginatorBase, filter: ITeacherFilterModel):
    Observable<IResponse<IPaginator<ITeacherListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: TeacherOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeacherGetModel>>(config);
  }

  public getTeacher$(id: number): Observable<IResponse<ITeacherGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherById'
    };

    return this.graphqlService.requestToApi<ITeacherGetModel>(config);
  }

  public createTeacher$(body: ITeacherPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createTeacherQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createTeacher',
      useMultipart: true
    };

    return this.graphqlService.requestToApi<ITeacherGetModel>(config);
  }

  public updateTeacher$(body: ITeacherPutModel): Observable<IResponse<ITeacherGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateTeacherQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateTeacher',
      useMultipart: true
    };

    return this.graphqlService.requestToApi<ITeacherGetModel>(config);
  }

  public deleteTeacher$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteTeacherQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteTeacher'
    };

    return this.graphqlService.requestToApi<ITeacherGetModel>(config);
  }

  public getCommissionDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCommissionDropdown,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCommissionsList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getDepartmentDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getDepartmentDropdown,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getDepartmentsList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getTeachingRankDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeachingRankDropdown,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeachingRankList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getAcademicDegreeDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicDegreeDropdown,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAcademicDegreeList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getAcademicTitleDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicTitleDropdown,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAcademicTitleList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getTeacherAttestationList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<ITeacherAttestationListResponseModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherAttestationList,
      variables: {query: {page: paginator.page, size: paginator.size, ...filter}, teacherId: filter.teacherId},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
    };

    return this.graphqlService.requestToApi<ITeacherAttestationListResponseModel>(config);
  }

  public getTeacherHonorList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<IPaginator<ITeacherHonorListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherHonorList,
      variables: {query: {page: paginator.page, size: paginator.size, ...filter}},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getHonorList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeacherHonorListGetModel>>(config);
  }

  public getTeacherRebukeList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<IPaginator<ITeacherRebukeListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherRebukeList,
      variables: {query: {page: paginator.page, size: paginator.size, ...filter}},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getRebukeList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeacherRebukeListGetModel>>(config);
  }

  public getTeacherInternshipList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<ITeacherInternshipListResponseModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherInternshipList,
      variables: {query: {page: paginator.page, size: paginator.size, ...filter}, teacherId: filter.teacherId},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
    };

    return this.graphqlService.requestToApi<ITeacherInternshipListResponseModel>(config);
  }

  public getTeacherEducationList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<IPaginator<ITeacherEducationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherEducationList,
      variables: {query: {page: paginator.page, size: paginator.size, ...filter}},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeacherEducationListGetModel>>(config);
  }

  public getTeacherPublicationList(paginator: IPaginatorBase, filter: ICommonTeacherDataFilterGetModel):
    Observable<IResponse<IPaginator<ITeacherPublicationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getTeacherPublicationList,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          teacherIds: [filter.teacherId],
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getPublicationList'
    };

    return this.graphqlService.requestToApi<IPaginator<ITeacherPublicationListGetModel>>(config);
  }
}
