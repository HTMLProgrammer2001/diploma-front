import {Injectable} from '@angular/core';
import {IError} from '../../shared/types/error';
import {ErrorViewModel} from '../../shared/types/error-view-model';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {Router} from '@angular/router';
import {CustomNotificationService} from './custom-notification.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorCodeArray: Array<ErrorViewModel> = [
    {
      code: -1000,
      message: 'Get data error, save disabled',
      isNotNeedToShow: true,
    },
    {
      code: -1001,
      message: 'File was changed after selecting',
      source: -1
    },
    {
      code: -1002,
      source: -1,
      message: 'No internet connection'
    },
    {
      code: 12,
      message: 'Data was changed by another user or into another bookmark',
    },
    {
      code: 16,
      message: 'Invalid login or password'
    },
    {
      code: 19,
      message: 'Token is expired'
    },
    {
      code: 20,
      message: 'Token is invalid'
    }
  ];

  constructor(private router: Router, private notificationService: CustomNotificationService) {}

  /** Get list of errors for display **/
  getMessagesToShow(errors: Array<IError>): Array<ErrorViewModel> {
    const errorsToShow: Array<ErrorViewModel> = [];
    if (!isEmpty(errors)) {
      errors.forEach((element) => {
        const foundElement = cloneDeep(this.errorCodeArray
          .find(error => (error.code === element.code && error.source === element.source))) ??
          cloneDeep(this.errorCodeArray.find(error => (error.code === element.code)));

        if (foundElement && !foundElement.isNotNeedToShow) {
          if (!foundElement.message) {
            foundElement.message = element.message;
          }
          errorsToShow.push(foundElement);
        }
      });
    }
    return errorsToShow;
  }

  redirectIfUnauthorized(errors: Array<IError>) {
    const errorAuth = errors.find(error => (error.code === 1 && error.source === 18) || error.code === 16);
    if (!isNil(errorAuth)) {
      this.notificationService.closeDialogs();
       this.router.navigate(['/login']);
    }
  }
}
