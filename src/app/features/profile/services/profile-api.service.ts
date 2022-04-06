import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IProfileGetModel} from '../types/model/profile-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {deleteProfile, editProfileQuery, getProfileQuery} from './profile-queries';
import {IProfilePutModel} from '../types/model/profile-put-model';

@Injectable({providedIn: 'root'})
export class ProfileApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getProfile$(): Observable<IResponse<IProfileGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getProfileQuery,
      isPreloader: true,
      isAuthorize: true,
      resultField: 'getProfile'
    };

    return this.graphqlService.requestToApi<IProfileGetModel>(config);
  }

  public updateProfile$(body: IProfilePutModel): Observable<IResponse<IProfileGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: editProfileQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      useMultipart: true,
      resultField: 'editProfile'
    };

    return this.graphqlService.requestToApi<IProfileGetModel>(config);
  }

  public deleteProfile$(guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteProfile,
      variables: {guid},
      isPreloader: true,
      isAuthorize: true,
      resultField: 'deleteProfile'
    };

    return this.graphqlService.requestToApi<IdSimpleItem>(config);
  }
}
