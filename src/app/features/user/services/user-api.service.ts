import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IdSimpleItem} from '../../../shared/types/id-simple-item';
import {IUserGetModel} from '../types/model/user-get-model';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, userEditRoles} from '../../../shared/roles';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {
  createUserQuery,
  deleteUserQuery,
  getRoleDropdownItemQuery,
  getRoleListDropdownQuery,
  getUserByIdQuery,
  getUserListQuery,
  updateUserQuery
} from './user-queries';
import {IUserFilterModel} from '../types/model/user-filter-model';
import {IUserPostModel} from '../types/model/user-post-model';
import {IUserPutModel} from '../types/model/user-put-model';
import {IUserListGetModel} from '../types/model/user-list-get-model';
import {UserOrderMap} from '../types/common/user-order-map';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';

@Injectable({providedIn: 'root'})
export class UserApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getUserList$(paginator: IPaginatorBase, filter: IUserFilterModel): Observable<IResponse<IPaginator<IUserListGetModel>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getUserListQuery,
      variables: {
        query: {
          page: paginator.page,
          size: paginator.size,
          orderField: UserOrderMap[paginator.sort?.[0].field ?? 'id'],
          isDesc: paginator.sort?.[0].dir === 'desc' ?? false,
          ...filter,
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getUserList'
    };

    return this.graphqlService.requestToApi<IPaginator<IUserGetModel>>(config);
  }

  public getUser$(id: number): Observable<IResponse<IUserGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getUserByIdQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getUserById'
    };

    return this.graphqlService.requestToApi<IUserGetModel>(config);
  }

  public createUser$(body: IUserPostModel): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: createUserQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      useMultipart: true,
      roles: userEditRoles,
      resultField: 'createUser'
    };

    return this.graphqlService.requestToApi<IUserGetModel>(config);
  }

  public updateUser$(body: IUserPutModel): Observable<IResponse<IUserGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: updateUserQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      useMultipart: true,
      roles: userEditRoles,
      resultField: 'updateUser'
    };

    return this.graphqlService.requestToApi<IUserGetModel>(config);
  }

  public deleteUser$(id: number, guid: string): Observable<IResponse<IdSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: deleteUserQuery,
      variables: {id, guid},
      isPreloader: true,
      isAuthorize: true,
      roles: userEditRoles,
      resultField: 'deleteUser'
    };

    return this.graphqlService.requestToApi<IUserGetModel>(config);
  }

  public getRoleDropdown$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getRoleListDropdownQuery,
      variables: {page: paginator.page, size: paginator.size, name: paginator.quickSearchFilter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getRoleList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getRoleDropdownItem$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getRoleDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getRoleById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }
}
