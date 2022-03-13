import {Injectable} from '@angular/core';
import {Config} from '../../types/config';
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

  constructor(private authMapperService: AuthMapperService, private apollo: Apollo) {}

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
          let errors: Array<IError> = [];

          if (err.graphQLErrors?.length) {
            errors = errors.concat(err.graphQLErrors);
          }

          if (err.clientErrors?.length) {
            errors = errors.concat(err.clientErrors);
          }

          if (err.networkError?.length) {
            errors = errors.concat(err.networkError);
          }

          return throwError({errors});
        })
      );
  }

  public logout$(refreshToken: string): Observable<IResponse<ResultResponse>> {
      return this.apollo.mutate<{ logout: ResultResponse }>({
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
        catchError((err) => {
          let errors: Array<IError> = [];

          if (err.graphQLErrors?.length) {
            errors = errors.concat(err.graphQLErrors);
          }

          if (err.clientErrors?.length) {
            errors = errors.concat(err.clientErrors);
          }

          if (err.networkError?.length) {
            errors = errors.concat(err.networkError);
          }

          return throwError({errors});
        })
      );
  }

  public refreshToken$(refreshToken: string): Observable<IResponse<AuthViewModel>> {
      return this.apollo.mutate<{ refreshToken: AuthViewModel }>({
          mutation: gql`
              mutation RefreshUserToken($refreshToken: String!) {
                  refreshToken(refreshToken: $refreshToken) {
                      accessToken
                      refreshToken
                  }
              }
          `,
        variables: {refreshToken},
      }).pipe(
        map(response => ({
          status: Status.ok,
          data: response.data?.refreshToken,
          errors: [],
        })),
        catchError((err) => {
          let errors: Array<IError> = [];

          if (err.graphQLErrors?.length) {
            errors = errors.concat(err.graphQLErrors);
          }

          if (err.clientErrors?.length) {
            errors = errors.concat(err.clientErrors);
          }

          if (err.networkError?.length) {
            errors = errors.concat(err.networkError);
          }

          return throwError({errors});
        })
      );
  }
}
