import {Injectable} from '@angular/core';
import {IError} from '../../shared/types/error';
import {ErrorViewModel} from '../../shared/types/error-view-model';
import {isEmpty, isNil} from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomNotificationService} from './custom-notification.service';
import {ErrorCodesEnum} from '../types/error-codes.enum';
import {defer, from, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private router: Router, private route: ActivatedRoute, private notificationService: CustomNotificationService) {}

  getMessagesToShow(errors: Array<IError>): Array<ErrorViewModel> {
    let errorsToShow: Array<ErrorViewModel> = [];

    if (!isEmpty(errors)) {
      errors.forEach(error => {
        if (error.code === ErrorCodesEnum.ARRAY_ERROR) {
          errorsToShow = [...errorsToShow, ...this.getMessagesToShow(error.errors)];
        } else {
          errorsToShow.push(error);
        }
      });
    }

    return errorsToShow;
  }

  redirectIfUnauthorized(errors: Array<IError>): Observable<void> {
    const errorAuth = errors.find(error => error.code === ErrorCodesEnum.UNAUTHORIZED);

    if (!isNil(errorAuth)) {
      this.notificationService.closeDialogs();
      return defer<void>(() => this.router.navigate(['/login'], {
          queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
          queryParamsHandling: 'merge'
        }));
    }
    else {
      return of(null);
    }
  }

  isNotFound(errors: Array<IError>): boolean {
    return !!errors.find(error => error.code === ErrorCodesEnum.NOT_FOUND);
  }
}
