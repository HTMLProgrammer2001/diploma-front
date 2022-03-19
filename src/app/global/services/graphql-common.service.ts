import {Observable, throwError} from 'rxjs';
import {RequestConfig} from '../types/request-config';
import {AuthService} from './auth/auth.service';
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {IResponse} from '../../shared/types/response';
import {RequestType} from '../types/request-type';
import {Apollo} from 'apollo-angular';
import {Status} from '../types/status';
import {IError} from '../../shared/types/error';
import {FetchResult} from '@apollo/client/core';
import {LanguageService} from './language.service';
import {ErrorCodesEnum} from '../types/error-codes.enum';

export class HttpOptions {
  headers?: Record<string, string>;
}

@Injectable()
export class GraphqlCommonService {
  constructor(private apollo: Apollo, private authService: AuthService, private languageService: LanguageService) {
  }

  public requestToApi<T>(requestConfig: RequestConfig): Observable<IResponse<T>> {
    const httpOptions = new HttpOptions();
    const httpHeaders: Record<string, string> = {};

    if (requestConfig.isPreloader) {
      httpHeaders.preloader = 'on';
    }

    if (this.languageService.getCurrentLanguage()) {
      httpHeaders.language = this.languageService.getCurrentLanguageCode();
    }

    return this.authService.checkAuthorization(requestConfig).pipe(
      mergeMap(value => {
        if ('authorization' in value) {
          httpHeaders.authorization = value.authorization;
        }

        httpOptions.headers = httpHeaders;
        return this.configureApiCall<T>(requestConfig, httpOptions).pipe(
          catchError(error => {
            if ((error as IResponse<any>).errors?.findIndex(item => item.code === 19) >= 0) {
              return this.authService.refreshToken().pipe(
                map(() => ({authorization: this.authService.accessToken})),
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

  public configureApiCall<T>(requestConfig: RequestConfig, httpOptions: HttpOptions): Observable<IResponse<T>> {
    let request: Observable<FetchResult<T>>;

    if (requestConfig.requestType === RequestType.MUTATION) {
      request = this.apollo.mutate<T>({
        mutation: requestConfig.query,
        variables: requestConfig.variables,
        context: {headers: {...httpOptions.headers, ...requestConfig.additionalHeaders}, useMultipart: !!requestConfig.useMultipart},
        fetchPolicy: 'no-cache',
      });
    } else {
      request = this.apollo.query<T>({
        query: requestConfig.query,
        variables: requestConfig.variables,
        context: {headers: {...httpOptions.headers, ...requestConfig.additionalHeaders}, useMultipart: !!requestConfig.useMultipart},
        fetchPolicy: 'no-cache',
      });
    }

    return request.pipe(
      map(response => ({
        status: Status.ok,
        data: requestConfig.resultField ? response.data?.[requestConfig.resultField] : response.data,
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

        if (err.errors?.length) {
          errors = errors.concat(err.errors);
        }

        if(err.message && !errors.length) {
          errors.push({message: err.message, code: ErrorCodesEnum.REQUEST_ERROR});
        }

        return throwError({errors});
      })
    );
  }
}
