import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Validator} from '../../../../shared/types/validation/validator';
import {TitleHeaderElementManager} from '../../../../shared/components/title-header/types/title-header-element-manager';
import {TitleHeaderElement} from '../../../../shared/components/title-header/types/title-header-element';
import {Observable, ReplaySubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {cloneDeep, isEmpty, isEqual, isNil} from 'lodash';
import {DialogCloseResult, DialogRef} from '@progress/kendo-angular-dialog';
import {takeUntil} from 'rxjs/operators';
import {UserMapperService} from '../../services/user-mapper.service';
import {UserFacadeService} from '../../services/user-facade.service';
import {UserValidationService} from '../../services/user-validation.service';
import {IUserViewModel} from '../../types/view-model/user-view-model';
import {readRoles, userEditRoles} from '../../../../shared/roles';
import {IUserDetailsViewState} from '../../types/view-model/user-details-view-state';
import {DomSanitizer} from '@angular/platform-browser';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';
import {ValidationTypes} from '../../../../shared/types/validation/validation-types';

@Component({
  selector: 'cr-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.scss']
})
export class ViewUserDetailsComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public userId: number;
  public user: IUserViewModel;
  public titleValue = '';
  public isNew = false;
  public editable: boolean;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: IUserDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public getRoleDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getRoleDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected userValidationService: UserValidationService,
    private userFacadeService: UserFacadeService,
    private userMapperService: UserMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.USER.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.USER.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.categoryDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();

    if (this.document.location.pathname.endsWith('user/new')) {
      this.isNew = true;
    } else {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.userFacadeService.getUserDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.initDropdowns();
    this.getData();

    this.userFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.refresh());

    this.editable = userEditRoles.includes(this.authService.currentRole);
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
    return !isEqual(this.currentBookmark.data.userDetail, this.currentBookmark.data.userDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.user);
    if (this.validator.dtoValidationResult.isValid) {
      this.userFacadeService.createUser$(this.user)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('USER.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
          this.navigateToDataPageAfterCreating(value.id);
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

  deleteData(): void {
    const deleteDialog: DialogRef = this.customNotificationService.showDialogDelete();

    deleteDialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if (result.text === this.translateService.instant('COMMON.BUTTON.YES')) {
          this.userFacadeService.deleteUser$(this.user)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().userDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().userDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService
                .instant('USER.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.userDetail)) {
      this.currentBookmark.data.userDetail = this.userMapperService.userInitializeViewModel();
      this.currentBookmark.data.userDetailCopy = cloneDeep(this.currentBookmark.data.userDetail);
      this.setData(this.currentBookmark.data.userDetail);
    } else if(this.isNew) {
      this.setData(this.currentBookmark.data.userDetail);
    } else if (isFinite(this.userId)) {
      this.userFacadeService.getUser$(this.userId)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => this.setData(value), error => {
          this.viewState.isNotFound = this.errorService.isNotFound(error.errors);
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const errorDialog = this.customNotificationService.showDialogError(errors);
            errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        });
    } else {
      this.customNotificationService.showError(this.translateService.instant('COMMON.INVALID_ID'));
    }
  }

  navigateToDataPageAfterCreating(id: number): any {
    this.bookmarkService.deleteBookmarkById(this.bookmarkService.getCurrentId()).subscribe(_ => {
      const route = `user/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: IUserViewModel): void {
    this.validator.setDto(value);
    this.user = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.user);

    if (this.validator.dtoValidationResult.isValid) {
      this.userFacadeService.updateUser$(this.user)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('USER.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialUserValidator = this.userValidationService.getUserValidator();

    if (!isNil(this.currentBookmark.viewState.userValidator)) {
      initialUserValidator.initValidatorResultStates(this.currentBookmark.viewState.userValidator);
    }

    this.currentBookmark.viewState.userValidator = initialUserValidator;
    this.validator = this.currentBookmark.viewState.userValidator;

    const requiredPasswordRule = this.validator.getRule('password', ValidationTypes.required);
    requiredPasswordRule.isActive = this.isNew;
  }

  initDropdowns(): void {
    this.getRoleDropdownList = this.userFacadeService.getRoleDropdownList$.bind(this.userFacadeService);
    this.getRoleDropdownItem = this.userFacadeService.getRoleDropdownItem$.bind(this.userFacadeService);
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.user.fullName || (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/user/new`;
    return this.router.navigate([route]);
  }

  refresh(): void {
    this.bookmarkService.cleanCurrentCacheData();
    this.getData();
  }

  restore(): void {
    this.viewState.restoring = true;
    this.refreshTitleHeaderButtons();
  }

  cancelRestore(): void {
    this.user = cloneDeep(this.bookmarkService.getCurrentDataItem().userDetailCopy);
    this.bookmarkService.getCurrentDataItem().userDetail = this.user;
    this.viewState.restoring = false;
    this.refreshTitleHeaderButtons();
    this.changeTitle();
  }

  confirmRestore(): void {
    alert('Restore');
  }

  onAvatarChange(file: File) {
    if (this.user.avatarUrl) {
      URL.revokeObjectURL(this.user.avatarUrl);
    }

    if (file) {
      this.user.avatarUrl = URL.createObjectURL(file);
    }
    else {
      this.user.avatarUrl = null;
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
      .setVisibility(false)
      .addElement('restore')
      .setVisibility(false)
      .addElement('confirm-restore')
      .setVisibility(false)
      .addElement('cancel-restore')
      .setVisibility(false)
      .addElement('delete-status')
      .setVisibility(false)
      .addElement('refresh')
      .setVisibility(false)
      .addElement('add')
      .setVisibility(false)
      .addElement('create')
      .setVisibility(false)
      .addElement('update')
      .setVisibility(false)
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  refreshTitleHeaderButtons(): void {
    this.titleHeaderButtonManager.getById('delete')
      .setVisibility(!this.user.isDeleted && !this.isNew && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.user.isDeleted && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.user.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.user.isDeleted && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.user.isDeleted && this.viewState.restoring
        && userEditRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.user.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.userFacadeService.refreshDetails$.next();
        break;

      case 'delete':
        this.deleteData();
        break;

      case 'add':
        this.openNewData();
        break;

      case 'update':
        this.updateData();
        break;

      case 'create':
        this.createData();
        break;

      case 'restore':
        this.restore();
        break;

      case 'cancel-restore':
        this.cancelRestore();
        break;

      case 'confirm-restore':
        this.confirmRestore();
        break;
    }
  }

  // endregion
}
