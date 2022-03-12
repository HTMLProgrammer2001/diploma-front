import {Injectable} from '@angular/core';
import {Config} from '../../types/config';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {ILoginViewModel} from '../../types/auth/login-view-model';
import {AuthMapperService} from './auth-mapper.service';
import {catchError, map} from 'rxjs/operators';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {Apollo, gql} from 'apollo-angular';
import {Status} from '../../../shared/constants/status';
import {ResultResponse} from '../../../shared/types/result-response';
import {IError} from '../../../shared/types/error';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  config: Config = null;

  constructor(
    private authMapperService: AuthMapperService,
    private http: HttpClient,
    private apollo: Apollo,
  ) {
  }

  public login$(user: ILoginViewModel): Observable<IResponse<AuthViewModel>> {
      return this.apollo.mutate<{ login: AuthViewModel }>({
          mutation: gql`
              mutation LoginUser($email: String!, $password: String!) {
                  login(body: {email: $email, password: $password}) {
                      accessToken
                      refreshToken
                  }
              }
          `,
        variables: user,
        context: {headers: {preloader: 'on'}}
      }).pipe(
        map(response => ({
          status: Status.ok,
          data: response.data?.login,
          errors: [],
        })),
        catchError((err) => {
          const errors: Array<IError> = [];
          return throwError({errors: err.networkError.errors});
        })
      );
  }

  public logout$(refreshToken: string): Observable<IResponse<ResultResponse>> {
      return this.apollo.mutate<{logout: ResultResponse}>({
          mutation: gql`
              mutation LogoutUser($refreshToken: String!) {
                  logout(refreshToken: $refreshToken) {
                      result
                  }
              }
          `,
        variables: {refreshToken},
        context: {headers: {preloader: 'on'}}
      }).pipe(
        map(response => ({
          status: Status.ok,
          data: response.data?.logout,
          errors: [],
        })),
        catchError((err) => throwError({errors: err.networkError.errors}))
      );
  }

  public refreshToken$(refreshToken: string): Observable<IResponse<AuthViewModel>> {
      return this.apollo.mutate<{logout: AuthViewModel}>({
          mutation: gql`
              mutation RefreshUserToken($refreshToken: String!) {
                  refreshToken(refreshToken: $refreshToken) {
                      accessToken
                      refreshToken
                  }
              }
          `,
        variables: {refreshToken},
        context: {headers: {preloader: 'on'}}
      }).pipe(
        map(response => ({
          status: Status.ok,
          data: response.data?.logout,
          errors: [],
        })),
        catchError((err) => throwError({errors: err.networkError.errors}))
      );
  }
}
