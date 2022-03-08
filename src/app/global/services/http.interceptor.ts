import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {iif, Observable, of, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';
import {Injectable} from '@angular/core';
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
    let cloneRequest = cloneDeep(req); // req.clone();

    // check preloader and start
    let preloaderRequestId: string;
    if (req.headers.has('preloader')) {
      preloaderRequestId = this.preloaderService.start();
      // this.loggerService.debug('>>>>>>>>> ApiHttpInterceptor: Start Preloader '  + preloaderRequestId);
    }

    //region file modification #TODO Make a more elegant decision for clearing content type when sending file for upload
    if (req.headers.has('fileUploadHeader')) {
      // req.headers.delete('fileUploadHeader');
    } else {
      req.headers.append('content-type', 'application/json; charset=utf-8');
    }
    //endregion file modification
    if (this.configService.getConfig()) {
      cloneRequest = req.clone({
        url: req.url, //req.url.replace('https', 'http'),
        headers: req.headers
          //.append('Customer-Number', this.configService.getConfig().companyNumber)
          .delete('fileUploadHeader')
          .delete('preloader'),
      });
    }

    if (true) {// (isDevMode()) {
      this.loggerService.apiRequest(cloneRequest.method, cloneRequest.url.replace('http://', ''), cloneRequest);
    }

    //add appType to headers
    cloneRequest = req.clone({headers: req.headers.append('Client-App-Type', '1')});

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
            // check preloader and stop
            if (req.headers.has('preloader')) {
              this.preloaderService.stop(preloaderRequestId);
              // this.loggerService.debug('<<<<<<<<<<ApiHttpInterceptor: Stop Preloader ' + preloaderRequestId);
            }
            if (true) { //isDevMode()
              const value = cloneDeep(event);
              this.loggerService.apiResponse(
                cloneRequest.method,
                `${cloneRequest.url.replace('http://', '')}`,
                value, String((new Date().getTime()) - startTime));
            }
            if (event.body.errors) {
              event.body.errors.map(error => {
                if (true) { //isDevMode()
                  this.loggerService.error(error.message);
                }
                this.notificationService.show({
                  content: error.message,
                  hideAfter: 5000,
                  position: {horizontal: 'right', vertical: 'bottom'},
                  animation: {type: 'fade', duration: 400},
                  type: {style: 'error', icon: true},
                });
              });
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
          // this.loggerService.debug('<<<<<<<<<<ApiHttpInterceptor: Stop Preloader ' + preloaderRequestId);
        }

        // lost internet connection
        if (Number(err.status) === 0) {
          this.customNotificationService.showNoInternetConnection();
          return;
        }

        return throwError(err);
      }));
  }
}
