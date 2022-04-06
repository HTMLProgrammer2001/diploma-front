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
import {CategoryMapperService} from '../../services/category-mapper.service';
import {CategoryFacadeService} from '../../services/category-facade.service';
import {CategoryValidationService} from '../../services/category-validation.service';
import {ICategoryViewModel} from '../../types/view-model/category-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {ICategoryDetailsViewState} from '../../types/view-model/category-details-view-state';

@Component({
  selector: 'cr-view-category-details',
  templateUrl: './view-category-details.component.html',
  styleUrls: ['./view-category-details.component.scss']
})
export class ViewCategoryDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public categoryId: number;
  public category: ICategoryViewModel;
  public titleValue = '';
  public isNew = false;
  public editable: boolean;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: ICategoryDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected categoryValidationService: CategoryValidationService,
    private categoryFacadeService: CategoryFacadeService,
    private categoryMapperService: CategoryMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.CATEGORY.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.CATEGORY.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.categoryDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();

    if (this.document.location.pathname.endsWith('category/new')) {
      this.isNew = true;
    } else {
      this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.categoryFacadeService.getCategoryDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.categoryFacadeService.refreshDetails$
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
    return !isEqual(this.currentBookmark.data.categoryDetail, this.currentBookmark.data.categoryDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.category);
    if (this.validator.dtoValidationResult.isValid) {
      this.categoryFacadeService.createCategory$(this.category)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('CATEGORY.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.categoryFacadeService.deleteCategory$(this.category)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().categoryDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().categoryDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService
                .instant('CATEGORY.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.categoryDetail)) {
      this.currentBookmark.data.categoryDetail = this.categoryMapperService.categoryInitializeViewModel();
      this.currentBookmark.data.categoryDetailCopy = cloneDeep(this.currentBookmark.data.categoryDetail);
      this.setData(this.currentBookmark.data.categoryDetail);
    } else if (this.isNew) {
      this.setData(this.currentBookmark.data.categoryDetail);
    } else if (isFinite(this.categoryId)) {
      this.categoryFacadeService.getCategory$(this.categoryId)
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
      const route = `category/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: ICategoryViewModel): void {
    this.validator.setDto(value);
    this.category = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.category);

    if (this.validator.dtoValidationResult.isValid) {
      this.categoryFacadeService.updateCategory$(this.category)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('CATEGORY.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialCategoryValidator = this.categoryValidationService.getCategoryValidator();

    if (!isNil(this.currentBookmark.viewState.categoryValidator)) {
      initialCategoryValidator.initValidatorResultStates(this.currentBookmark.viewState.categoryValidator);
    }

    this.currentBookmark.viewState.categoryValidator = initialCategoryValidator;
    this.validator = this.currentBookmark.viewState.categoryValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.category.name || (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/category/new`;
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
    this.category = cloneDeep(this.bookmarkService.getCurrentDataItem().categoryDetailCopy);
    this.bookmarkService.getCurrentDataItem().categoryDetail = this.category;
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
      .setVisibility(!this.category.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.category.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.category.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.category.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.category.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.category.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.categoryFacadeService.refreshDetails$.next();
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
