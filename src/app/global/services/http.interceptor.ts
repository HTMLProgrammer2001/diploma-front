import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {iif, Observable, of, throwError} from 'rxjs';
import {catchError, finalize, switchMap, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';
import {Injectable, isDevMode} from '@angular/core';
import {ConfigService} from './config.service';
import {NotificationService} from '@progress/kendo-angular-notification';
import {PreloaderService} from './preloader.service';
import {cloneDeep, isEmpty} from 'lodash';
import {Router} from '@angular/router';
import {NetworkStatusService} from './network-status.service';
import {CustomNotificationService} from './custom-notification.service';
import {LanguageService} from './language.service';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpInterceptor implements HttpInterceptor {
  constructor(
    private languageService: LanguageService,
    private loggerService: LoggerService,
    private configService: ConfigService,
    private router: Router,
    private notificationService: NotificationService,
    private customNotificationService: CustomNotificationService,
    private preloaderService: PreloaderService,
    private networkStatusService: NetworkStatusService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = new Date().getTime();
    let cloneRequest = cloneDeep(req);

    // check preloader and start
    let preloaderRequestId: string;
    if (req.headers.has('preloader')) {
      preloaderRequestId = this.preloaderService.start();
    }

    cloneRequest = req.clone({
      url: req.url,
      headers: req.headers.delete('preloader'),
    });

    if (isDevMode()) {
      this.loggerService.apiRequest(cloneRequest.method, cloneRequest.url.replace('http://', ''), cloneRequest);
    }

    if (this.languageService.getCurrentLanguageCode()) {
      cloneRequest = req.clone({headers: req.headers.append('Language', this.languageService.getCurrentLanguageCode())});
    }

    return next.handle(cloneRequest).pipe(
      tap(event => {
          if (!this.networkStatusService.online) {
            this.customNotificationService.showNoInternetConnection();
            return;
          }

          if (event instanceof HttpResponse) {
            if (isDevMode()) {
              const value = cloneDeep(event);
              this.loggerService.apiResponse(
                cloneRequest.method,
                `${cloneRequest.url.replace('http://', '')}`,
                value, String(new Date().getTime() - startTime));
            }

            if (event.body.errors && isDevMode()) {
              event.body.errors.forEach(error => this.loggerService.error(error));
            }
          }
        },
      ),
      switchMap(value =>
        iif(
          () => (value instanceof HttpResponse) && !isEmpty(value.body.errors),
          throwError((value as HttpResponse<any>).body), of(value)),
      ),
      catchError(err => {
        // check preloader and stop
        if (req.headers.has('preloader')) {
          this.preloaderService.stop(preloaderRequestId);
        }

        // lost internet connection
        if (Number(err.status) === 0) {
          this.customNotificationService.showNoInternetConnection();
          return;
        }

        return throwError(err);
      }),
      finalize(() => {
        // check preloader and stop
        if (req.headers.has('preloader')) {
          this.preloaderService.stop(preloaderRequestId);
        }
      }));
  }
}
