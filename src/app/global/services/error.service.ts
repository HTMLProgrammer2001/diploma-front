import {Injectable} from '@angular/core';
import {IError} from '../../shared/types/error';
import {ErrorViewModel} from '../../shared/types/error-view-model';
import {isEmpty, isNil} from 'lodash';
import {Router} from '@angular/router';
import {CustomNotificationService} from './custom-notification.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private router: Router, private notificationService: CustomNotificationService) {}

  getMessagesToShow(errors: Array<IError>): Array<ErrorViewModel> {
    let errorsToShow: Array<ErrorViewModel> = [];

    if (!isEmpty(errors)) {
      errors.forEach(error => {
        if (error.code === 0) {
          errorsToShow = [...errorsToShow, ...this.getMessagesToShow(error.errors)];
        } else {
          errorsToShow.push(error);
        }
      });
    }

    return errorsToShow;
  }

  redirectIfUnauthorized(errors: Array<IError>) {
    const errorAuth = errors.find(error => error.code === 101);

    if (!isNil(errorAuth)) {
      this.notificationService.closeDialogs();
      this.router.navigate(['/login']);
    }
  }
}
