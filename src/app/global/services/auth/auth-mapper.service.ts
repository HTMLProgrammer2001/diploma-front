import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {AuthModel} from '../../types/auth/auth-model';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {ILoginModel} from '../../types/auth/login-model';
import {ILoginViewModel} from '../../types/auth/login-view-model';

@Injectable({
  providedIn: 'root'
})
export class AuthMapperService {
  public authToViewModel(source: AuthModel): AuthViewModel {
    const destination = new AuthViewModel();
    if (!isNil(source)) {
      destination.accessToken = source.accessToken;
      destination.refreshToken = source.refreshToken;
    }
    return destination;
  }

  public loginViewModelToModel(source: ILoginViewModel): ILoginModel {
    const destination = {} as ILoginModel;

    if (!isNil(source)) {
      destination.password = source.password;
      destination.email = source.email;
    }

    return destination;
  }

  public initializeLoginViewModel(): ILoginViewModel {
    return {
      email: '',
      password: ''
    };
  }
}
