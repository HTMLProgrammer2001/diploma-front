import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IEducationQualificationGetModel} from '../types/model/education-qualification-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createEducationQualificationQuery,
  deleteEducationQualificationQuery,
  getEducationQualificationByIdQuery,
  getEducationQualificationEducationsListQuery,
  getEducationQualificationListQuery,
  updateEducationQualificationQuery
} from './education-qualification-queries';
import {IEducationQualificationFilterModel} from '../types/model/education-qualification-filter-model';
import {IEducationQualificationPostModel} from '../types/model/education-qualification-post-model';
import {IEducationQualificationPutModel} from '../types/model/education-qualification-put-model';
import {IEducationQualificationEducationsFilterModel} from '../types/model/education-qualification-educations-filter-model';
import {IEducationQualificationListGetModel} from '../types/model/education-qualification-list-get-model';
import {EducationQualificationOrderMap} from '../types/common/education-qualification-order-map';
import {IEducationQualificationEducationGetModel} from '../types/model/education-qualification-education-get-model';

@Injectable({providedIn: 'root'})
export class EducationQualificationApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getEducationQualificationList$(paginator: IPaginatorBase, filter: IEducationQualificationFilterModel):
    Observable<IResponse<IPaginator<IEducationQualificationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationQualificationListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: EducationQualificationOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationQualificationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IEducationQualificationGetModel>>(config);
  }

  public getEducationQualification$(id: number): Observable<IResponse<IEducationQualificationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationQualificationByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationQualificationById'
    };

    return this.graphqlService.requestToApi<IEducationQualificationGetModel>(config);
  }

  public createEducationQualification$(body: IEducationQualificationPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createEducationQualificationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'createEducationQualification'
    };

    return this.graphqlService.requestToApi<IEducationQualificationGetModel>(config);
  }

  public updateEducationQualification$(body: IEducationQualificationPutModel): Observable<IResponse<IEducationQualificationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateEducationQualificationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'updateEducationQualification'
    };

    return this.graphqlService.requestToApi<IEducationQualificationGetModel>(config);
  }

  public deleteEducationQualification$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteEducationQualificationQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'deleteEducationQualification'
    };

    return this.graphqlService.requestToApi<IEducationQualificationGetModel>(config);
  }

  public getEducationQualificationEducationsList$(paginator: IPaginatorBase, filter: IEducationQualificationEducationsFilterModel):
    Observable<IResponse<IPaginator<IEducationQualificationEducationGetModel>>> {

    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getEducationQualificationEducationsListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getEducationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IEducationQualificationEducationGetModel>>(config);
  }
}
