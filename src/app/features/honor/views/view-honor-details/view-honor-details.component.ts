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
import {HonorMapperService} from '../../services/honor-mapper.service';
import {HonorFacadeService} from '../../services/honor-facade.service';
import {HonorValidationService} from '../../services/honor-validation.service';
import {IHonorViewModel} from '../../types/view-model/honor-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IHonorDetailsViewState} from '../../types/view-model/honor-details-view-state';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-honor-details',
  templateUrl: './view-honor-details.component.html',
  styleUrls: ['./view-honor-details.component.scss']
})
export class ViewHonorDetailsComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public honorId: number;
  public honor: IHonorViewModel;
  public titleValue = '';
  public isNew = false;
  public editable: boolean;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: IHonorDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected honorValidationService: HonorValidationService,
    private honorFacadeService: HonorFacadeService,
    private honorMapperService: HonorMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.HONOR.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.HONOR.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.honorDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();
    this.initDropdowns();

    if (this.document.location.pathname.endsWith('honor/new')) {
      this.isNew = true;
    } else {
      this.honorId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.honorFacadeService.getHonorDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.honorFacadeService.getTeacherDropdownList$.bind(this.honorFacadeService);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.honorFacadeService.refreshDetails$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.refresh());

    this.editable = writeRoles.includes(this.authService.currentRole);
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
    return !isEqual(this.currentBookmark.data.honorDetail, this.currentBookmark.data.honorDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.honor);
    if (this.validator.dtoValidationResult.isValid) {
      this.honorFacadeService.createHonor$(this.honor)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('HONOR.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.honorFacadeService.deleteHonor$(this.honor)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().honorDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().honorDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService.instant('HONOR.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.honorDetail)) {
      this.currentBookmark.data.honorDetail = this.honorMapperService.honorInitializeViewModel();
      this.currentBookmark.data.honorDetailCopy = cloneDeep(this.currentBookmark.data.honorDetail);
      this.setData(this.currentBookmark.data.honorDetail);
    }
    else if(this.isNew) {
      this.setData(this.currentBookmark.data.honorDetail);
    } else if (isFinite(this.honorId)) {
      this.honorFacadeService.getHonor$(this.honorId)
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
      const route = `honor/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: IHonorViewModel): void {
    this.validator.setDto(value);
    this.honor = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.honor);

    if (this.validator.dtoValidationResult.isValid) {
      this.honorFacadeService.updateHonor$(this.honor)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('HONOR.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialHonorValidator = this.honorValidationService.getHonorValidator();

    if (!isNil(this.currentBookmark.viewState.honorValidator)) {
      initialHonorValidator.initValidatorResultStates(this.currentBookmark.viewState.honorValidator);
    }

    this.currentBookmark.viewState.honorValidator = initialHonorValidator;
    this.validator = this.currentBookmark.viewState.honorValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.honor.title || (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/honor/new`;
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
    this.honor = cloneDeep(this.bookmarkService.getCurrentDataItem().honorDetailCopy);
    this.bookmarkService.getCurrentDataItem().honorDetail = this.honor;
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
      .setVisibility(!this.honor.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.honor.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.honor.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.honor.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.honor.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.honor.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.honorFacadeService.refreshDetails$.next();
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
