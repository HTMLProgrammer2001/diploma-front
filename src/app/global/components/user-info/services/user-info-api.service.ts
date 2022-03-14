import {Injectable} from '@angular/core';
import {GraphqlCommonService} from '../../../services/graphql-common.service';
import {Observable} from 'rxjs';
import {IResponse} from '../../../../shared/types/response';
import {IUserInfoProfileGetModel} from '../types/user-info-profile-get-model';
import {RequestConfig} from '../../../types/request-config';
import {RequestType} from '../../../types/request-type';
import {getUserInfoQuery} from './user-info-queries';

@Injectable({providedIn: 'root'})
export class UserInfoApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getProfile$(): Observable<IResponse<IUserInfoProfileGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getUserInfoQuery,
      isAuthorize: true,
      isPreloader: true,
      resultField: 'getProfile'
    };

    return this.graphqlService.requestToApi<IUserInfoProfileGetModel>(config);
  }
}
