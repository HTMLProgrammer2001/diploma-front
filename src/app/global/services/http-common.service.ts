import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CustomEncoder} from '../types/custom-encoder';
import {RestMethods} from '../types/rest-methods';
import {Observable, throwError} from 'rxjs';
import {RequestConfig} from '../types/request-config';
import {AuthService} from './auth/auth.service';
import {Injectable} from '@angular/core';
import {isNil} from 'lodash';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {interpolateUrl} from '../../shared/utils';
import {IResponse} from '../../shared/types/response';

export class HttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable({
  providedIn: 'root',
})
export class HttpCommonService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  public requestToApi<T>(requestConfig: RequestConfig, options: HttpOptions = null): Observable<T> {
    const httpOptions = options ?? new HttpOptions();
    let httpHeaders = new HttpHeaders();

    if ('queryParams' in requestConfig) {
      httpOptions.params = this.configureQueryParams(requestConfig.queryParams);
    }

    if ('isPreloader' in requestConfig && requestConfig.isPreloader) {
      httpHeaders = httpHeaders.append('preloader', 'on');
    }

    return this.authService.checkAuthorization(requestConfig).pipe(
      mergeMap(value => {
        //httpHeaders = httpHeaders.set('Customer-Number', value.get('Customer-Number'));

        if (value?.has('Authorization')) {
          httpHeaders = httpHeaders.append('Authorization', value.get('Authorization'));
        }
        httpOptions.headers = httpHeaders;
        return this.configureApiCall<T>(requestConfig, httpOptions).pipe(
          catchError(error => {
            if ((error as IResponse<any>).errors?.findIndex(item => item.code === 19) >= 0) {
              //19	ExpiredTokenError https://wiki.nayax.com/display/NR/Response+DTO+Structure
              return this.authService.refreshToken().pipe(
                map(() => {
                  let headers: HttpHeaders = new HttpHeaders();
                  // headers = headers.append('Customer-Number', this.authService.companyNumber?.toString());
                  headers = headers.append('Authorization', this.authService.accessToken);
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

          //
          // switchMap(_ => this.authService.refreshToken().pipe(
          //   map(() => {
          //     let headers: HttpHeaders = new HttpHeaders();
          //     headers = headers.append('Customer-Number', this.authService.companyNumber?.toString());
          //     headers = headers.append('Authorization', this.authService.accessToken);
          //     return headers;
          //   }))),


          // switchMap(headers => {
          //   httpOptions.headers = headers;
          //   return this.configureApiCall<T>(requestConfig, httpOptions);
          // }),
        );

      }),
    );
  }

  private configureQueryParams(queryParams: any): HttpParams {
    let params = new HttpParams({encoder: new CustomEncoder()});
    Object.keys(queryParams).forEach(value => {
      if (Array.isArray(queryParams[value])) {
        queryParams[value].forEach(item => {
          params = params.append(value, item);
        });
      }
      if (!isNil(queryParams[value]) && queryParams[value] !== '' && !Array.isArray(queryParams[value])) {
        params = params.append(value, queryParams[value]);
      }
    });
    return params;
  }

  public configureApiCall<T>(requestConfig: RequestConfig,
                             httpOptions: HttpOptions): Observable<T> {
    // if (!isNil(requestConfig.endpointConfiguration) && !requestConfig.endpointConfiguration.isAccessGranted) {
    //   const error: IErrorAuth = {errors: new Array<IError>()};
    //   error.errors.push({code: 510, message: 'Access denied'});
    //   return throwError(error);
    // }
    let url = isNil(requestConfig.endpointConfiguration) ?
      requestConfig.url : requestConfig.endpointConfiguration.url;
    if ('requestParams' in requestConfig) {
      url = interpolateUrl(requestConfig.endpointConfiguration.url, requestConfig.requestParams);
    }
    const restMethod = isNil(requestConfig.endpointConfiguration) ?
      requestConfig.restMethod : requestConfig.endpointConfiguration.restMethod;

    switch (restMethod) {
      case RestMethods.get:
        return this.httpClient.get<T>(url, httpOptions);
      case RestMethods.post:
        return this.httpClient.post<T>(url, requestConfig.body, httpOptions);
      case RestMethods.put:
        return this.httpClient.put<T>(url, requestConfig.body, httpOptions);
      case RestMethods.delete:
        return this.httpClient.delete<T>(url, httpOptions);
    }
  }
}
