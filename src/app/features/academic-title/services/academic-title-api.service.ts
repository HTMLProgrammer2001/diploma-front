import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IAcademicTitleGetModel} from '../types/model/academic-title-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createAcademicTitleQuery,
  deleteAcademicTitleQuery,
  getAcademicTitleByIdQuery,
  getAcademicTitleListQuery,
  getAcademicTitleTeachersListQuery,
  updateAcademicTitleQuery
} from './academic-title-queries';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {IAcademicTitleFilterModel} from '../types/model/academic-title-filter-model';
import {IAcademicTitlePostModel} from '../types/model/academic-title-post-model';
import {IAcademicTitlePutModel} from '../types/model/academic-title-put-model';
import {IAcademicTitleTeachersFilterModel} from '../types/model/academic-title-teachers-filter-model';
import {IAcademicTitleListGetModel} from '../types/model/academic-title-list-get-model';
import {AcademicDegreeOrderMap} from '../../academic-degree/types/common/academic-degree-order-map';

@Injectable({providedIn: 'root'})
export class AcademicTitleApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getAcademicTitleList$(paginator: IPaginatorBase, filter: IAcademicTitleFilterModel):
    Observable<IResponse<IPaginator<IAcademicTitleListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicTitleListQuery,
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
      resultField: 'getAcademicTitleList'
    };

    return this.graphqlService.requestToApi<IPaginator<IAcademicTitleGetModel>>(config);
  }

  public getAcademicTitle$(id: number): Observable<IResponse<IAcademicTitleGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicTitleByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAcademicTitleById'
    };

    return this.graphqlService.requestToApi<IAcademicTitleGetModel>(config);
  }

  public createAcademicTitle$(body: IAcademicTitlePostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createAcademicTitleQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createAcademicTitle'
    };

    return this.graphqlService.requestToApi<IAcademicTitleGetModel>(config);
  }

  public updateAcademicTitle$(body: IAcademicTitlePutModel): Observable<IResponse<IAcademicTitleGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateAcademicTitleQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateAcademicTitle'
    };

    return this.graphqlService.requestToApi<IAcademicTitleGetModel>(config);
  }

  public deleteAcademicTitle$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteAcademicTitleQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteAcademicTitle'
    };

    return this.graphqlService.requestToApi<IAcademicTitleGetModel>(config);
  }

  public getAcademicTitleTeachersList$(paginator: IPaginatorBase, filter: IAcademicTitleTeachersFilterModel):
    Observable<IResponse<IPaginator<IdNameSimpleItem>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAcademicTitleTeachersListQuery,
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
