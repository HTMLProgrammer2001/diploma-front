import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IUserListViewModel} from '../types/view-model/user-list-view-model';
import {IUserViewModel} from '../types/view-model/user-view-model';
import {IUserFilterViewModel} from '../types/view-model/user-filter-view-model';
import {IUserGetModel} from '../types/model/user-get-model';
import {IUserPutModel} from '../types/model/user-put-model';
import {IUserPostModel} from '../types/model/user-post-model';
import {IUserDetailsViewState} from '../types/view-model/user-details-view-state';
import {IUserFilterModel} from '../types/model/user-filter-model';
import {IUserListGetModel} from '../types/model/user-list-get-model';

@Injectable({
  providedIn: 'root',
})
export class UserMapperService {
  public userListGetModelToViewModel(source: IUserListGetModel): IUserListViewModel {
    let destination = {} as IUserListViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        email: source.email,
        fullName: source.fullName,
        role: source.role,
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public userGetModelToViewModel(source: IUserGetModel): IUserViewModel {
    let destination = {} as IUserViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        fullName: source.fullName,
        role: source.role,
        email: source.email,
        avatar: null,
        avatarUrl: source.avatarUrl,
        phone: source.phone,
        guid: source.guid,
        password: '',
        isDeleted: source.isDeleted
      };
    }

    return destination;
  }

  public userViewModelToPutModel(source: IUserViewModel): IUserPutModel {
    let destination = {} as IUserPutModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        avatar: source.avatar,
        fullName: source.fullName,
        phone: source.phone,
        email: source.email,
        password: source.password ? source.password : undefined,
        roleId: source.role.id,
        guid: source.guid
      };
    }

    return destination;
  }

  public userViewModelToPostModel(source: IUserViewModel): IUserPostModel {
    let destination = {} as IUserPostModel;

    if (!isNil(source)) {
      destination = {
        password: source.password,
        email: source.email,
        fullName: source.fullName,
        roleId: source.role.id,
        avatar: source.avatar,
        phone: source.phone
      };
    }

    return destination;
  }

  public userInitializeViewModel(): IUserViewModel {
    return {
      id: null,
      email: '',
      password: '',
      avatar: null,
      role: {
        id: null,
        name: ''
      },
      phone: '',
      fullName: '',
      avatarUrl: '',
      guid: null,
      isDeleted: false
    };
  }

  public userInitializeFilterViewModel(): IUserFilterViewModel {
    return {
      roleId: null,
      email: '',
      fullName: '',
      showDeleted: false
    };
  }

  public userInitializeDetailsViewState(): IUserDetailsViewState {
    return {
      isNotFound: false,
      restoring: false
    };
  }

  public userFilterViewModelToModel(source: IUserFilterViewModel): IUserFilterModel {
    let destination = {} as IUserFilterModel;

    if (!isNil(source)) {
      destination = {
        roleId: source.roleId,
        email: source.email,
        fullName: source.fullName,
        showDeleted: source.showDeleted
      };
    }

    return destination;
  }
}
