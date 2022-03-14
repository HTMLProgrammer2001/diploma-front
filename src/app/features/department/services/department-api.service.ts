import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IDepartmentGetModel} from '../types/model/department-get-model';
import {IDepartmentPostModel} from '../types/model/department-post-model';
import {IDepartmentPutModel} from '../types/model/department-put-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createDepartmentQuery,
  deleteDepartmentQuery,
  getDepartmentByIdQuery,
  getDepartmentListQuery,
  getDepartmentTeachersListQuery,
  updateDepartmentQuery
} from './department-queries';
import {IDepartmentListGetModel} from '../types/model/department-list-get-model';
import {IDepartmentFilterModel} from '../types/model/department-filter-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IDepartmentTeachersFilterModel} from '../types/model/department-teachers-filter-model';

@Injectable({providedIn: 'root'})
export class DepartmentApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getDepartmentList$(paginator: IPaginatorBase, filter: IDepartmentFilterModel):
    Observable<IResponse<IPaginator<IDepartmentListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getDepartmentListQuery,
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
      resultField: 'getDepartmentsList'
    };

    return this.graphqlService.requestToApi<IPaginator<IDepartmentListGetModel>>(config);
  }

  public getDepartment$(id: number): Observable<IResponse<IDepartmentGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getDepartmentByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getDepartmentById'
    };

    return this.graphqlService.requestToApi<IDepartmentGetModel>(config);
  }

  public createDepartment$(body: IDepartmentPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createDepartmentQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createDepartment'
    };

    return this.graphqlService.requestToApi<IDepartmentGetModel>(config);
  }

  public updateDepartment$(body: IDepartmentPutModel): Observable<IResponse<IDepartmentGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateDepartmentQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateDepartment'
    };

    return this.graphqlService.requestToApi<IDepartmentGetModel>(config);
  }

  public deleteDepartment$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteDepartmentQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteDepartment'
    };

    return this.graphqlService.requestToApi<IDepartmentGetModel>(config);
  }

  public getDepartmentTeachersList$(paginator: IPaginatorBase, filter: IDepartmentTeachersFilterModel):
    Observable<IResponse<IPaginator<IdNameSimpleItem>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getDepartmentTeachersListQuery,
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
