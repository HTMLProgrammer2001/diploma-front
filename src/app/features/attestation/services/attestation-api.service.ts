import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IAttestationGetModel} from '../types/model/attestation-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createAttestationQuery,
  deleteAttestationQuery,
  getAttestationByIdQuery,
  getAttestationListQuery,
  getCategoryDropdownItemQuery,
  getCategoryDropdownQuery,
  getTeacherDropdownItemQuery,
  getTeacherDropdownQuery,
  updateAttestationQuery
} from './attestation-queries';
import {IAttestationFilterModel} from '../types/model/attestation-filter-model';
import {IAttestationPostModel} from '../types/model/attestation-post-model';
import {IAttestationPutModel} from '../types/model/attestation-put-model';
import {IAttestationListGetModel} from '../types/model/attestation-list-get-model';
import {AttestationOrderMap} from '../types/common/attestation-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class AttestationApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getAttestationList$(paginator: IPaginatorBase, filter: IAttestationFilterModel):
    Observable<IResponse<IPaginator<IAttestationListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAttestationListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: AttestationOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAttestationList'
    };

    return this.graphqlService.requestToApi<IPaginator<IAttestationGetModel>>(config);
  }

  public getAttestation$(id: number): Observable<IResponse<IAttestationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getAttestationByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getAttestationById'
    };

    return this.graphqlService.requestToApi<IAttestationGetModel>(config);
  }

  public createAttestation$(body: IAttestationPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createAttestationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'createAttestation'
    };

    return this.graphqlService.requestToApi<IAttestationGetModel>(config);
  }

  public updateAttestation$(body: IAttestationPutModel): Observable<IResponse<IAttestationGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateAttestationQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'updateAttestation'
    };

    return this.graphqlService.requestToApi<IAttestationGetModel>(config);
  }

  public deleteAttestation$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteAttestationQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'deleteAttestation'
    };

    return this.graphqlService.requestToApi<IAttestationGetModel>(config);
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

  public getCategoryDropdown$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCategoryDropdownQuery,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCategoryList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getCategoryDropdownItem$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getCategoryDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCategoryById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }
}
