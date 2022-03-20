import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IAcademicDegreeGetModel} from '../types/model/academic-degree-get-model';
import {IAcademicDegreePostModel} from '../types/model/academic-degree-post-model';
import {IAcademicDegreePutModel} from '../types/model/academic-degree-put-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createAcademicDegreeQuery,
  deleteAcademicDegreeQuery,
  getAcademicDegreeByIdQuery,
  getAcademicDegreeListQuery,
  getAcademicDegreeTeachersListQuery,
  updateAcademicDegreeQuery
} from './academic-degree-queries';
import {IAcademicDegreeListGetModel} from '../types/model/academic-degree-list-get-model';
import {IAcademicDegreeFilterModel} from '../types/model/academic-degree-filter-model';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IAcademicDegreeTeachersFilterModel} from '../types/model/academic-degree-teachers-filter-model';
import {IAcademicDegreeViewModel} from '../types/view-model/academic-degree-view-model';
import {AcademicDegreeOrderMap} from '../types/common/academic-degree-order-map';
import {TeacherOrderMap} from '../../teacher/types/common/teacher-order-map';

@Injectable({providedIn: 'root'})
export class AcademicDegreeApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getAcademicDegreeList$(paginator: IPaginatorBase, filter: IAcademicDegreeFilterModel):
    Observable<IResponse<IPaginator<IAcademicDegreeListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicDegreeListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: AcademicDegreeOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAcademicDegreeList'
    };

    return this.graphqlService.requestToApi<IPaginator<IAcademicDegreeListGetModel>>(config);
  }

  public getAcademicDegree$(id: number): Observable<IResponse<IAcademicDegreeGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicDegreeByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAcademicDegreeById'
    };

    return this.graphqlService.requestToApi<IAcademicDegreeGetModel>(config);
  }

  public createAcademicDegree$(body: IAcademicDegreePostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createAcademicDegreeQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createAcademicDegree'
    };

    return this.graphqlService.requestToApi<IAcademicDegreeGetModel>(config);
  }

  public updateAcademicDegree$(body: IAcademicDegreePutModel): Observable<IResponse<IAcademicDegreeGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateAcademicDegreeQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateAcademicDegree'
    };

    return this.graphqlService.requestToApi<IAcademicDegreeGetModel>(config);
  }

  public deleteAcademicDegree$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteAcademicDegreeQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteAcademicDegree'
    };

    return this.graphqlService.requestToApi<IAcademicDegreeGetModel>(config);
  }

  public getAcademicDegreeTeachersList$(paginator: IPaginatorBase, filter: IAcademicDegreeTeachersFilterModel):
    Observable<IResponse<IPaginator<IdNameSimpleItem>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicDegreeTeachersListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: TeacherOrderMap.name,
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
