import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Validator} from '../../../../shared/types/validation/validator';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {ReplaySubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {takeUntil} from 'rxjs/operators';
import {NotificationFacadeService} from '../../services/notification-facade.service';
import {isEmpty, isEqual, isNil} from 'lodash';
import {NotificationValidationService} from '../../services/notification-validation.service';
import {INotificationConfigViewModel} from '../../types/view-model/notification-config-view-model';
import {ValidationResult} from '../../../../shared/types/validation/validation-result';
import {INotificationTypeViewModel} from '../../types/view-model/notification-type-view-model';
import {NotificationTypesEnum} from '../../types/common/notification-types.enum';
import {ValidationRule} from '../../../../shared/types/validation/validation-rule';
import {ValidationTypes} from '../../../../shared/types/validation/validation-types';
import {INotificationDayViewModel} from '../../types/view-model/notification-day-view-model';


@Component({
  selector: 'cr-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss']
})
export class ViewNotificationComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public NotificationTypesEnum = NotificationTypesEnum;
  public config: INotificationConfigViewModel;
  public validator: Validator;
  public cache: IViewNotificationCache;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public adminEmailsValidationResult: ValidationResult;
  public notifyDayValidationRule: ValidationRule;
  public notifyTypes: Array<INotificationTypeViewModel> = [];
  public notifyDays: Array<INotificationDayViewModel> = [];
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    private notificationFacadeService: NotificationFacadeService,
    private notificationValidationService: NotificationValidationService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.NOTIFICATION.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.NOTIFICATION.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.notification,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);

    this.initTitleHeaderButtons();
    this.initValidator();
    this.initCache();

    this.notificationFacadeService.getNotificationTypes$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(types => this.notifyTypes = types);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.notificationFacadeService.getNotificationConfig$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        config => {
          this.config = config;
          this.notifyDayValidationRule.isActive = this.config.notifyType !== NotificationTypesEnum.DAILY;
        },
        error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const errorDialog = this.customNotificationService.showDialogError(errors);
            errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.currentBookmarkTask.isDataChanged = this.checkDataChanged();
    this.currentBookmarkTask.checkDataChanged = null;
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  //endregion

  checkDataChanged(): boolean {
    return !isEqual(this.currentBookmark.data.notificationConfigCopy, this.currentBookmark.data.notificationConfig);
  }

  // region Inits

  initCache() {
    this.cache = this.bookmarkService.getCurrentDataViewState('ViewNotificationCache');
  }

  initValidator() {
    const initialNotificationValidator = this.notificationValidationService.getValidator();

    if (!isNil(this.currentBookmark.viewState.notificationValidator)) {
      initialNotificationValidator.initValidatorResultStates(this.currentBookmark.viewState.notificationValidator);
    }

    this.currentBookmark.viewState.notificationValidator = initialNotificationValidator;
    this.validator = this.currentBookmark.viewState.notificationValidator;
    this.adminEmailsValidationResult = this.validator.getResult('adminEmails');
    this.notifyDayValidationRule = this.validator.getRule('notifyDay', ValidationTypes.required);
  }

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('pin')
      .addElement('refresh')
      .addElement('custom')
      .setAppearance('secondary-button')
      .setNameTranslateKey('NOTIFICATION.NOTIFY_NOW')
      .setId('notify-now')
      .addElement('update')
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.refresh();
        break;

      case 'update':
        this.updateConfig();
        break;

      case 'notify-now':
        this.notifyNow();
        break;
    }
  }

  // endregion

  //region Events

  updateConfig() {
    this.validator.setDto(this.config);
    this.validator.validateDto(this.config);

    if(this.validator.dtoValidationResult.isValid) {
      this.notificationFacadeService.updateNotificationConfig$(this.config)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          resp => {
            this.config = resp;
            this.notificationFacadeService.refresh$.next();
            this.customNotificationService.showSuccess(this.translateService.instant('NOTIFICATION.NOTIFICATION.SUCCESS_UPDATE'));
          },
          error => {
            const errors = this.errorService.getMessagesToShow(error.errors);

            if (!isEmpty(errors)) {
              const errorDialog = this.customNotificationService.showDialogError(errors);
              errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
            }
          }
        );
    }
    else {
      this.customNotificationService.showDialogValidation(this.validator);
    }
  }

  notifyNow() {
    this.notificationFacadeService.triggerNotification$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(result => {
        if (result) {
          this.customNotificationService.showSuccess('NOTIFICATION.NOTIFICATION.SUCCESS_TRIGGER');
        } else {
          this.customNotificationService.showError('NOTIFICATION.NOTIFICATION.ERROR_TRIGGER');
        }
      }, error => {
        const errors = this.errorService.getMessagesToShow(error.errors);

        if (!isEmpty(errors)) {
          const errorDialog = this.customNotificationService.showDialogError(errors);
          errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
        }
      });
  }

  refresh() {
    this.notificationFacadeService.refresh$.next();

    this.notificationFacadeService.loadNotificationConfig$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        config => {
          this.config = config;
          this.notifyDayValidationRule.isActive = this.config.notifyType !== NotificationTypesEnum.DAILY;
        },
        error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const errorDialog = this.customNotificationService.showDialogError(errors);
            errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        }
      );
  }

  validateAdminEmails() {
    this.validator.validateField('adminEmails', this.config.adminEmails);
  }

  get maxNotifyBeforeDays() {
    return this.config.attestationYearsPeriod * 365;
  }

  onNotifyTypeChange() {
    this.config.notifyDay = null;
    this.notifyDayValidationRule.isActive = this.config.notifyType !== NotificationTypesEnum.DAILY;

    if(this.config.notifyType === NotificationTypesEnum.WEEKLY) {
      this.notificationFacadeService.getNotificationWeekDays$()
        .pipe(takeUntil(this.onDestroy))
        .subscribe(days => this.notifyDays = days);
    }
  }

  //endregion
}

interface IViewNotificationCache {
  adminEmailInput: string;
}
