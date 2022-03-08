import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {AuthModel} from '../../types/auth/auth-model';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {UserAuthModel} from '../../types/auth/user-auth-model';
import {User} from '../../types/auth/user';

@Injectable({
  providedIn: 'root'
})
export class AuthMapperService {
  public authToViewModel(source: AuthModel): AuthViewModel {
    const destination = new AuthViewModel();
    if (!isNil(source)) {
      destination.accessToken = source.accessToken;
      destination.refreshToken = source.refreshToken;
      destination.sessionId = source.sessionId;
      destination.companies = source.companies;
      destination.firstName = source.firstName;
      destination.lastName = source.lastName;
    }
    return destination;
  }

  public userToUserAuthModel(source: User): UserAuthModel {
    const destination = {} as UserAuthModel;

    if (!isNil(source)) {
      destination.password = source.password;
      destination.login = source.login;
      destination.firstName = source.firstName;
      destination.lastName = source.lastName;
    }

    return destination;
  }
}
