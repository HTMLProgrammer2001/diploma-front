import {Injectable} from '@angular/core';
import {PaginatorRequest} from '../../../shared/types/paginator-request';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {RequestConfig} from '../../../global/types/request-config';
import {Config} from '../../../global/types/config';
import {HttpCommonService} from '../../../global/services/http-common.service';
import {AuthService} from '../../../global/services/auth/auth.service';
import {ConfigService} from '../../../global/services/config.service';
import {IRoleListGetModel} from '../types/model/role-list-get-model';
import {IRoleDetailsGetModel} from '../types/model/role-details-get-model';
import {IRoleDetailsPostModel} from '../types/model/role-details-post-model';
import {IRoleDetailsPutModel} from '../types/model/role-details-put-model';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
  private config: Config = null;

  constructor(private httpService: HttpCommonService, private authService: AuthService, private configService: ConfigService) {
    this.config = configService.getConfig();
  }

  public roleList$(paginator: PaginatorRequest):
    Observable<IResponse<IPaginator<IRoleListGetModel>>> {
    const config: RequestConfig = {
      queryParams: {...paginator},
      isPreloader: true,
      isAuthorize: true,
    };
    return this.httpService.requestToApi<IResponse<IPaginator<IRoleListGetModel>>>(config);
  }

  public getRole$(id: number): Observable<IResponse<IRoleDetailsGetModel>> {
    const config: RequestConfig = {
      requestParams: {id},
      isPreloader: true,
      isAuthorize: true,
    };

    return this.httpService.requestToApi<IResponse<IRoleDetailsGetModel>>(config);
  }

  public createRole$(role: IRoleDetailsPostModel): Observable<IResponse<IRoleDetailsGetModel>> {
    const config: RequestConfig = {
      body: role,
      isPreloader: true,
      isAuthorize: true,
    };

    return this.httpService.requestToApi<IResponse<IRoleDetailsGetModel>>(config);
  }

  public updateRole$(id: number, role: IRoleDetailsPutModel): Observable<IResponse<IRoleDetailsGetModel>> {
    const config: RequestConfig = {
      requestParams: {id},
      body: role,
      isPreloader: true,
      isAuthorize: true,
    };

    return this.httpService.requestToApi<IResponse<IRoleDetailsGetModel>>(config);
  }

  public deleteRole$(id: number): Observable<IResponse<string>> {
    const config: RequestConfig = {
      requestParams: {id},
      isPreloader: true,
      isAuthorize: true,
    };
    return this.httpService.requestToApi<IResponse<string>>(config);
  }
}
