import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Injectable, isDevMode} from '@angular/core';
import {PreloaderService} from './preloader.service';
import {NetworkStatusService} from './network-status.service';
import {CustomNotificationService} from './custom-notification.service';
import {LanguageService} from './language.service';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpInterceptor implements HttpInterceptor {
  constructor(
    private languageService: LanguageService,
    private customNotificationService: CustomNotificationService,
    private preloaderService: PreloaderService,
    private networkStatusService: NetworkStatusService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check preloader and start
    let preloaderRequestId: string;
    if (req.headers.has('preloader')) {
      preloaderRequestId = this.preloaderService.start();
    }

    const cloneRequest = req.clone({
      url: req.url,
      headers: req.headers.delete('preloader'),
    });

    return next.handle(cloneRequest).pipe(
      tap(event => {
          if (!this.networkStatusService.online) {
            this.customNotificationService.showNoInternetConnection();
            return;
          }

          if (event instanceof HttpResponse) {
            if (event.body.errors && isDevMode()) {
              event.body.errors.forEach(error => console.error(error));
            }
          }
        },
      ),
      catchError(err => {
        // check preloader and stop
        if (req.headers.has('preloader')) {
          this.preloaderService.stop(preloaderRequestId);
        }

        // lost internet connection
        if (Number(err.status) === 0) {
          this.customNotificationService.showNoInternetConnection();
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
