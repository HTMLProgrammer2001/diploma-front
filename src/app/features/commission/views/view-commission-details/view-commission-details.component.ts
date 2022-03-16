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
import {cloneDeep, isEmpty, isEqual, isNil} from 'lodash';
import {DialogCloseResult, DialogRef} from '@progress/kendo-angular-dialog';
import {takeUntil} from 'rxjs/operators';
import {CommissionMapperService} from '../../services/commission-mapper.service';
import {CommissionFacadeService} from '../../services/commission-facade.service';
import {CommissionValidationService} from '../../services/commission-validation.service';
import {ICommissionViewModel} from '../../types/view-model/commission-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {ICommissionDetailsViewState} from '../../types/view-model/commission-details-view-state';

@Component({
  selector: 'cr-view-commission-details',
  templateUrl: './view-commission-details.component.html',
  styleUrls: ['./view-commission-details.component.scss']
})
export class ViewCommissionDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public commissionId: number;
  public commission: ICommissionViewModel;
  public titleValue = '';
  public isNew = false;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: ICommissionDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected commissionValidationService: CommissionValidationService,
    private commissionFacadeService: CommissionFacadeService,
    private commissionMapperService: CommissionMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.COMMISSION.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.COMMISSION.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.commissionDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();

    if (this.document.location.pathname.endsWith('commission/new')) {
      this.isNew = true;
    } else {
      this.commissionId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.commissionFacadeService.getCommissionDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.commissionFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.refresh());
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
    return !isEqual(this.currentBookmark.data.commissionDetail, this.currentBookmark.data.commissionDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.commission);
    if (this.validator.dtoValidationResult.isValid) {
      this.commissionFacadeService.createCommission$(this.commission)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('COMMISSION.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.commissionFacadeService.deleteCommission$(this.commission)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().commissionDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().commissionDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService.instant('COMMISSION.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.commissionDetail)) {
      this.currentBookmark.data.commissionDetail = this.commissionMapperService.commissionInitializeViewModel();
      this.currentBookmark.data.commissionDetailCopy = cloneDeep(this.currentBookmark.data.commissionDetail);
      this.setData(this.currentBookmark.data.commissionDetail);
    } else if (isFinite(this.commissionId)) {
      this.commissionFacadeService.getCommission$(this.commissionId)
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
      const route = `commission/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: ICommissionViewModel): void {
    this.validator.setDto(value);
    this.commission = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.commission);

    if (this.validator.dtoValidationResult.isValid) {
      this.commissionFacadeService.updateCommission$(this.commission)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('COMMISSION.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialCommissionValidator = this.commissionValidationService.getCommissionValidator();

    if (!isNil(this.currentBookmark.viewState.commissionValidator)) {
      initialCommissionValidator.initValidatorResultStates(this.currentBookmark.viewState.commissionValidator);
    }

    this.currentBookmark.viewState.commissionValidator = initialCommissionValidator;
    this.validator = this.currentBookmark.viewState.commissionValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.commission.name ?? (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/commission/new`;
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
    this.commission = cloneDeep(this.bookmarkService.getCurrentDataItem().commissionDetailCopy);
    this.bookmarkService.getCurrentDataItem().commissionDetail = this.commission;
    this.viewState.restoring = false;
    this.refreshTitleHeaderButtons();
    this.changeTitle();
  }

  confirmRestore(): void {
    alert('Restore');
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
      .setVisibility(!this.commission.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.commission.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.commission.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.commission.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.commission.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.commission.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.commissionFacadeService.refreshDetails$.next();
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
