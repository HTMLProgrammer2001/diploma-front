import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IProfileGetModel} from '../types/model/profile-get-model';
import {IProfileViewModel} from '../types/view-model/profile-view-model';
import {IProfilePutModel} from '../types/model/profile-put-model';
import {IUserInfoProfileGetModel} from '../../../global/components/user-info/types/user-info-profile-get-model';

@Injectable({providedIn: 'root'})
export class ProfileMapperService {
  public profileGetModelToViewModel(source: IProfileGetModel): IProfileViewModel {
    let destination = {} as IProfileViewModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        email: source.email,
        fullName: source.fullName,
        role: source.role?.name,
        guid: source.guid,
        phone: source.phone,
        avatarUrl: source.avatarUrl,
      };
    }

    return destination;
  }

  public profileViewModelToPutModel(source: IProfileViewModel): IProfilePutModel {
    let destination = {} as IProfilePutModel;

    if (!isNil(source)) {
      destination = {
        avatar: source.avatar,
        fullName: source.fullName,
        phone: source.phone,
        email: source.email,
        password: source.password ? source.password : undefined,
        guid: source.guid
      };
    }

    return destination;
  }

  public profileViewModelToUserInfoProfileGetModel(source: IProfileViewModel): IUserInfoProfileGetModel {
    let destination = {} as IUserInfoProfileGetModel;

    if (!isNil(source)) {
      destination = {
        id: source.id,
        email: source.email,
        fullName: source.fullName,
        avatarUrl: source.avatarUrl
      };
    }

    return destination;
  }
}
