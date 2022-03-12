import {Injectable} from '@angular/core';
import {PaginatorRequest} from '../../../shared/types/paginator-request';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {Config} from '../../../global/types/config';
import {AuthService} from '../../../global/services/auth/auth.service';
import {ConfigService} from '../../../global/services/config.service';
import {IRoleListGetModel} from '../types/model/role-list-get-model';
import {IRoleDetailsGetModel} from '../types/model/role-details-get-model';
import {IRoleDetailsPostModel} from '../types/model/role-details-post-model';
import {IRoleDetailsPutModel} from '../types/model/role-details-put-model';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';

@Injectable({
  providedIn: 'root',
})
export class RoleApiService {
  private config: Config = null;

  constructor(private graphqlService: GraphqlCommonService, private authService: AuthService, private configService: ConfigService) {
    this.config = configService.getConfig();
  }

  public roleList$(paginator: PaginatorRequest):
    Observable<IResponse<IPaginator<IRoleListGetModel>>> {
    return null;
  }

  public getRole$(id: number): Observable<IResponse<IRoleDetailsGetModel>> {
    return null;
  }

  public createRole$(role: IRoleDetailsPostModel): Observable<IResponse<IRoleDetailsGetModel>> {
    return null;
  }

  public updateRole$(id: number, role: IRoleDetailsPutModel): Observable<IResponse<IRoleDetailsGetModel>> {
    return null;
  }

  public deleteRole$(id: number): Observable<IResponse<string>> {
    return null;
  }
}
