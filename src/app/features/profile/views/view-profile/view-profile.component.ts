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
import {isEmpty, isEqual, isNil} from 'lodash';
import {DialogCloseResult, DialogRef} from '@progress/kendo-angular-dialog';
import {takeUntil} from 'rxjs/operators';
import {ProfileFacadeService} from '../../services/profile-facade.service';
import {ProfileValidationService} from '../../services/profile-validation.service';
import {DomSanitizer} from '@angular/platform-browser';
import {IProfileViewModel} from '../../types/view-model/profile-view-model';

@Component({
  selector: 'cr-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public profile: IProfileViewModel;
  public titleValue = '';
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected profileValidationService: ProfileValidationService,
    private profileFacadeService: ProfileFacadeService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.PROFILE.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.PROFILE.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.profile,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();
  }

  ngOnDestroy(): void {
    this.currentBookmarkTask.isDataChanged = this.checkDataChanged();
    this.currentBookmarkTask.checkDataChanged = null;
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  //endregion

  // region Refresh and set data

  checkDataChanged(): boolean {
    return !isEqual(this.currentBookmark.data.profileDetail, this.currentBookmark.data.profileDetailCopy);
  }

  deleteData(): void {
    const deleteDialog: DialogRef = this.customNotificationService.showDialogDelete();

    deleteDialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if (result.text === this.translateService.instant('COMMON.BUTTON.YES')) {
          this.profileFacadeService.deleteProfile$(this.profile)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.customNotificationService.showSuccess(this.translateService
                .instant('PROFILE.NOTIFICATION.SUCCESS_DELETE'));

              this.authService.logout().subscribe(() => {
                this.router.navigateByUrl('/login');
              });
            }, error => {
              const errors = this.errorService.getMessagesToShow(error.errors);

              if (!isEmpty(errors)) {
                const errorDialog = this.customNotificationService.showDialogError(errors);
                errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
              }
            });
        }
      }
    });
  }

  getData(): void {
    this.profileFacadeService.getProfile$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(value => this.setData(value), error => {
        const errors = this.errorService.getMessagesToShow(error.errors);

        if (!isEmpty(errors)) {
          const errorDialog = this.customNotificationService.showDialogError(errors);
          errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
        }
      });
  }

  setData(value: IProfileViewModel): void {
    this.validator.setDto(value);
    this.profile = value;
    this.changeTitle();
  }

  updateData(): void {
    this.validator.validateDto(this.profile);

    if (this.validator.dtoValidationResult.isValid) {
      this.profileFacadeService.updateProfile$(this.profile)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('PROFILE.NOTIFICATION.SUCCESS_UPDATE'));
          this.setData(value);
        }, error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const errorDialog = this.customNotificationService.showDialogError(errors);
            errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        });
    } else {
      this.customNotificationService.showDialogValidation(this.validator);
    }
  }

  // endregion

  // region Initials

  initValidator(): void {
    const initialProfileValidator = this.profileValidationService.getUserValidator();

    if (!isNil(this.currentBookmark.viewState.profileValidator)) {
      initialProfileValidator.initValidatorResultStates(this.currentBookmark.viewState.profileValidator);
    }

    this.currentBookmark.viewState.profileValidator = initialProfileValidator;
    this.validator = this.currentBookmark.viewState.profileValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.profile.fullName;
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  refresh(): void {
    this.bookmarkService.cleanCurrentCacheData();
    this.getData();
  }

  onAvatarChange(file: File) {
    if (this.profile.avatarUrl) {
      URL.revokeObjectURL(this.profile.avatarUrl);
    }

    if (file) {
      this.profile.avatarUrl = URL.createObjectURL(file);
    } else {
      this.profile.avatarUrl = null;
    }
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // endregion

  // region Title header

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('delete')
      .setVisibility(true)
      .addElement('refresh')
      .setVisibility(true)
      .addElement('update')
      .setVisibility(true)
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.refresh();
        break;

      case 'delete':
        this.deleteData();
        break;

      case 'update':
        this.updateData();
        break;
    }
  }

  // endregion
}
