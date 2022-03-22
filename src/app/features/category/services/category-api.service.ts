import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {ICategoryGetModel} from '../types/model/category-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createCategoryQuery,
  deleteCategoryQuery,
  getCategoryAttestationsListQuery,
  getCategoryByIdQuery,
  getCategoryListQuery,
  updateCategoryQuery
} from './category-queries';
import {ICategoryFilterModel} from '../types/model/category-filter-model';
import {ICategoryPostModel} from '../types/model/category-post-model';
import {ICategoryPutModel} from '../types/model/category-put-model';
import {ICategoryListGetModel} from '../types/model/category-list-get-model';
import {CategoryOrderMap} from '../types/common/category-order-map';
import {TeacherOrderMap} from '../../teacher/types/common/teacher-order-map';
import {ICategoryAttestationGetModel} from '../types/model/category-attestation-get-model';
import {ICategoryAttestationsFilterModel} from '../types/model/category-attestations-filter-model';

@Injectable({providedIn: 'root'})
export class CategoryApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getCategoryList$(paginator: IPaginatorBase, filter: ICategoryFilterModel):
    Observable<IResponse<IPaginator<ICategoryListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCategoryListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: CategoryOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCategoryList'
    };

    return this.graphqlService.requestToApi<IPaginator<ICategoryGetModel>>(config);
  }

  public getCategory$(id: number): Observable<IResponse<ICategoryGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCategoryByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCategoryById'
    };

    return this.graphqlService.requestToApi<ICategoryGetModel>(config);
  }

  public createCategory$(body: ICategoryPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createCategoryQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createCategory'
    };

    return this.graphqlService.requestToApi<ICategoryGetModel>(config);
  }

  public updateCategory$(body: ICategoryPutModel): Observable<IResponse<ICategoryGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateCategoryQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateCategory'
    };

    return this.graphqlService.requestToApi<ICategoryGetModel>(config);
  }

  public deleteCategory$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteCategoryQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteCategory'
    };

    return this.graphqlService.requestToApi<ICategoryGetModel>(config);
  }

  public getCategoryAttestationsList$(paginator: IPaginatorBase, filter: ICategoryAttestationsFilterModel):
    Observable<IResponse<IPaginator<ICategoryAttestationGetModel>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCategoryAttestationsListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: 'ID',
          isDesc: false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAttestationList'
    };

    return this.graphqlService.requestToApi<IPaginator<ICategoryAttestationGetModel>>(config);
  }
}
