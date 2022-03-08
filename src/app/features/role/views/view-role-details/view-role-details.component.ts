import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {PopupTab} from '../../../../global/types/popup-tab';
import {Validator} from '../../../../shared/types/validation/validator';
import {TitleHeaderElementManager} from '../../../../global/types/title-header/title-header-element-manager';
import {TitleHeaderElement} from '../../../../global/types/title-header/title-header-element';
import {ReplaySubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {BookmarkService} from '../../../../global/services/bookmark.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {BookmarkIcon} from '../../../../shared/constants/bookmark-icon';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {cloneDeep, isEmpty, isEqual, isNil} from 'lodash';
import {Status} from '../../../../shared/constants/status';
import {DialogCloseResult, DialogRef} from '@progress/kendo-angular-dialog';
import {takeUntil} from 'rxjs/operators';
import {PanelBarItemModel} from '@progress/kendo-angular-layout/dist/es2015/panelbar/panelbar-item-model';
import {RoleDetailsViewModel} from '../../types/view-model/role-details-view-model';
import {RoleMapperService} from '../../services/role-mapper.service';
import {RoleFacadeService} from '../../services/role-facade.service';
import {RoleValidationService} from '../../services/role-validation.service';

@Component({
  selector: 'cr-view-role-details',
  templateUrl: './view-role-details.component.html'
})
export class ViewRoleDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public popupTab: PopupTab;
  public roleId: number;
  public titleValue = '';
  public isNew = false;
  public roleDetail: RoleDetailsViewModel = new RoleDetailsViewModel();
  public cache: ViewRoleDetailsComponentCache;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;

  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    protected roleValidationService: RoleValidationService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    private roleFacadeService: RoleFacadeService,
    private roleMapperService: RoleMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.ROLE_DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.ROLE_DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.adminRoleDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.currentBookmark.popupTab = PopupTab.getPopupTabAndInitStates(this.currentBookmark.popupTab);
    this.popupTab = this.currentBookmark.popupTab;
    this.initTitleHeaderButtons();

    if (this.document.location.pathname === '/role/new') {
      this.isNew = true;
    } else {
      this.roleId = Number(this.route.snapshot.paramMap.get('id'));
    }
  }


  ngOnInit(): void {
    this.initCache();
    this.initValidator();
    this.getData();
  }

  ngOnDestroy(): void {
    this.currentBookmarkTask.isDataChanged = this.checkDataChanged();
    this.currentBookmarkTask.checkDataChanged = null;
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // region Refresh and set data

  checkDataChanged(): boolean {
    return !isEqual(this.currentBookmark.data.roleUserDetail, this.currentBookmark.data.roleUserDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.roleDetail);
    if (this.validator.dtoValidationResult.isValid) {
      this.roleFacadeService.createRole$(this.roleDetail)
        .subscribe(value => {
          if (value.status === Status.ok) {
            this.customNotificationService
              .showSuccess(this.translateService.instant('ADMIN_ROLE.ROLE_DETAILS.NOTIFICATION.SUCCESS_CREATE'));
            this.navigateToDataPageAfterCreating(value.data.id);
          }
        }, error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const dialog = this.customNotificationService.showDialogError(errors);
            dialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        });
    } else {
      this.customNotificationService.showDialogValidation(this.validator);
    }
  }

  deleteData(): void {
    const dialog: DialogRef = this.customNotificationService.showDialogDelete();

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if (result.text === this.translateService.instant('COMMON.BUTTON.YES')) {
          this.roleFacadeService.deleteRole$(this.roleId)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().roleUserDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().roleUserDetailCopy.isDeleted = true;
              this.customNotificationService
                .showSuccess(this.translateService.instant('ADMIN_ROLE.ROLE_DETAILS.NOTIFICATION.SUCCESS_DELETE'));
            }, error => {
              this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors));
            });
        }
      }
    });
  }

  getData(): void {
    if (this.isNew && isNil(this.currentBookmark.data.roleUserDetail)) {
      this.currentBookmark.data.roleUserDetail = this.roleMapperService.roleInitializeViewModel();
      this.currentBookmark.data.roleUserDetailCopy = cloneDeep(this.currentBookmark.data.roleUserDetail);
      this.setData(this.currentBookmark.data.roleUserDetail);
    }

    //
    this.roleFacadeService.getRole$(this.roleId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(value => this.setData(value.data), error => {
        const errors = this.errorService.getMessagesToShow(error.errors);

        if (!isEmpty(errors)) {
          const dialog = this.customNotificationService.showDialogError(errors);
          dialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
        }
      });
  }

  navigateToDataPageAfterCreating(id: number): any {
    this.bookmarkService.deleteBookmarkById(this.bookmarkService.getCurrentId()).subscribe(_ => {
      const route = `role/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: RoleDetailsViewModel): void {
    this.validator.setDto(value);
    this.roleDetail = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.roleDetail);

    if (this.validator.dtoValidationResult.isValid) {
      this.roleFacadeService.updateRole$(this.roleDetail)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('ADMIN_ROLE.ROLE_DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
          this.setData(value.data);
        }, error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const dialog = this.customNotificationService.showDialogError(errors);
            dialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }

          this.customNotificationService.showError(this.translateService.instant('ADMIN_ROLE.ROLE_DETAILS.NOTIFICATION.ERROR_UPDATE'));
        });
    } else {
      this.customNotificationService.showDialogValidation(this.validator);
    }
  }

  // endregion

  // region Initials

  initCache() {
    this.cache = this.bookmarkService.getCurrentDataViewState('ViewRoleDetailsComponentCache');

    if (isEmpty(this.cache)) {
      this.cache.panelsViewState = {};
      this.cache.roleDetail = this.roleDetail;
    }

    this.roleDetail = this.cache.roleDetail;
  }

  initValidator(): void {
    const initialRoleValidator = this.roleValidationService.getRoleValidator();

    if (!isNil(this.currentBookmark.viewState.roleUserValidator)) {
      initialRoleValidator.initValidatorResultStates(this.currentBookmark.viewState.roleUserValidator);
    }

    this.currentBookmark.viewState.roleUserValidator = initialRoleValidator;
    this.validator = this.currentBookmark.viewState.roleUserValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.roleDetail.name ?? (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    // set bookmark
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  panelStateChange(panelName: string, event: Array<PanelBarItemModel>): void {
    const [firstEvent] = event;
    this.cache.panelsViewState[panelName] = firstEvent.expanded;
  }

  openNewData(): Promise<boolean> {
    const route = `/role/new`;
    return this.router.navigate([route]);
  }

  refresh(): void {
    this.bookmarkService.cleanCurrentCacheData();
    this.getData();
  }

  onEditPermissions() {
    this.popupTab.addTab({
      type: 'role-detail-permissions',
      titleTranslateKey: 'ADMIN_USER.ADMIN_ROLE.ROLES.TITLE',
    });
  }

  // endregion

  // region Popup
  changeActiveTab(event: number): void {
    this.popupTab.changedActive(event);
    this.bookmarkService.restoreScrollPosition();
  }

  removePopupTab(): void {
    // this.bookmarkService.deleteCurrentDataViewState('ManageRolePermissionsComponentCache');
    this.popupTab.close();
  }

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('delete')
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
      .setVisibility(!this.roleDetail.isDeleted && !this.isNew
        && true);

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && true);

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew
        && !this.roleDetail.isDeleted
        && true);

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew);

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && true);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh': {
        this.refresh();
        break;
      }
      case 'delete': {
        this.deleteData();
        break;
      }
      case 'add': {
        this.openNewData();
        break;
      }
      case 'update': {
        this.updateData();
        break;
      }
      case 'create': {
        this.createData();
        break;
      }
    }
  }

  // endregion

}

interface ViewRoleDetailsComponentCache {
  roleDetail: RoleDetailsViewModel;
  showPassword?: boolean;
  panelsViewState?: {
    permissions?: boolean;
  };
}
