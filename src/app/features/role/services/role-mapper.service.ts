import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {IRoleListGetModel} from '../types/model/role-list-get-model';
import {RoleListViewModel} from '../types/view-model/role-list-view-model';
import {RoleDetailsViewModel} from '../types/view-model/role-details-view-model';
import {IRoleDetailsPostModel} from '../types/model/role-details-post-model';
import {IRoleDetailsGetModel} from '../types/model/role-details-get-model';
import {IRoleDetailsPutModel} from '../types/model/role-details-put-model';

@Injectable({
  providedIn: 'root',
})
export class RoleMapperService {

  public roleToListViewModel(source: IRoleListGetModel): RoleListViewModel {
    const destination = new RoleListViewModel();
    if (!isNil(source)) {
      destination.id = source.id;
      destination.code = source.code;
      destination.name = source.name;
      destination.isDeleted = source.isDeleted;
    }
    return destination;
  }

  public roleViewModelToPutModel(source: RoleDetailsViewModel): IRoleDetailsPutModel {
    let destination: IRoleDetailsPutModel = null;
    if (!isNil(source)) {
      destination = {
        guid: source.guid,
        code: source.code,
        name: source.name
      };
    }
    return destination;
  }

  public roleGetModelToViewModel(source: IRoleDetailsGetModel): RoleDetailsViewModel {
    const destination: RoleDetailsViewModel = new RoleDetailsViewModel();
    if (!isNil(source)) {
      destination.guid = source.guid;
      destination.id = source.id;
      destination.isDeleted = source.isDeleted;
      destination.code = source.code;
      destination.name = source.name;
    }
    return destination;
  }

  public roleViewModelToPostModel(source: RoleDetailsViewModel): IRoleDetailsPostModel {
    let destination: IRoleDetailsPostModel = null;
    if (!isNil(source)) {
      destination = {
        code: source.code,
        name: source.name
      };
    }
    return destination;
  }

  public roleInitializeViewModel(): RoleDetailsViewModel {
    const destination = new RoleDetailsViewModel();
    destination.guid = null;
    destination.id = null;
    destination.code = null;
    destination.name = null;
    destination.isDeleted = false;
    return destination;
  }
}
