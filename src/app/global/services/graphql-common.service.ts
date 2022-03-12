import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {RequestConfig} from '../types/request-config';
import {AuthService} from './auth/auth.service';
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {IResponse} from '../../shared/types/response';

export class HttpOptions {
  headers?: Map<string, string>;
}

@Injectable()
export class GraphqlCommonService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public requestToApi<T>(requestConfig: RequestConfig, options: HttpOptions = null): Observable<T> {
    const httpOptions = options ?? new HttpOptions();
    let httpHeaders = new Map();

    if ('isPreloader' in requestConfig && requestConfig.isPreloader) {
      httpHeaders.set('preloader', 'on');
    }

    return this.authService.checkAuthorization(requestConfig).pipe(
      mergeMap(value => {
        if (value?.has('Authorization')) {
          httpHeaders = httpHeaders.set('Authorization', value.get('Authorization'));
        }

        httpOptions.headers = httpHeaders;
        return this.configureApiCall<T>(requestConfig, httpOptions).pipe(
          catchError(error => {
            if ((error as IResponse<any>).errors?.findIndex(item => item.code === 19) >= 0) {
              return this.authService.refreshToken().pipe(
                map(() => {
                  let headers = new Map();
                  headers = headers.set('Authorization', this.authService.accessToken);
                  return headers;
                }),
                switchMap(headers => {
                  httpOptions.headers = headers;
                  return this.configureApiCall<T>(requestConfig, httpOptions);
                }),
              );
            } else {
              return throwError(error);
            }
          }),
        );
      }),
    );
  }

  public configureApiCall<T>(requestConfig: RequestConfig, httpOptions: HttpOptions): Observable<T> {
    return of(null);
  }
}
