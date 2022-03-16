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
import {AcademicDegreeMapperService} from '../../services/academic-degree-mapper.service';
import {AcademicDegreeFacadeService} from '../../services/academic-degree-facade.service';
import {AcademicDegreeValidationService} from '../../services/academic-degree-validation.service';
import {IAcademicDegreeViewModel} from '../../types/view-model/academic-degree-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IAcademicDegreeDetailsViewState} from '../../types/view-model/academic-degree-details-view-state';

@Component({
  selector: 'cr-view-academic-degree-details',
  templateUrl: './view-academic-degree-details.component.html',
  styleUrls: ['./view-academic-degree-details.component.scss']
})
export class ViewAcademicDegreeDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public academicDegreeId: number;
  public academicDegree: IAcademicDegreeViewModel;
  public titleValue = '';
  public isNew = false;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: IAcademicDegreeDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected academicDegreeValidationService: AcademicDegreeValidationService,
    private academicDegreeFacadeService: AcademicDegreeFacadeService,
    private academicDegreeMapperService: AcademicDegreeMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.academicDegreeDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();

    if (this.document.location.pathname.endsWith('academic-degree/new')) {
      this.isNew = true;
    } else {
      this.academicDegreeId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.academicDegreeFacadeService.getAcademicDegreeDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.academicDegreeFacadeService.refreshDetails$
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
    return !isEqual(this.currentBookmark.data.academicDegreeDetail, this.currentBookmark.data.academicDegreeDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.academicDegree);
    if (this.validator.dtoValidationResult.isValid) {
      this.academicDegreeFacadeService.createAcademicDegree$(this.academicDegree)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('ACADEMIC_DEGREE.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.academicDegreeFacadeService.deleteAcademicDegree$(this.academicDegree)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().academicDegreeDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().academicDegreeDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService
                .instant('ACADEMIC_DEGREE.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.academicDegreeDetail)) {
      this.currentBookmark.data.academicDegreeDetail = this.academicDegreeMapperService.academicDegreeInitializeViewModel();
      this.currentBookmark.data.academicDegreeDetailCopy = cloneDeep(this.currentBookmark.data.academicDegreeDetail);
      this.setData(this.currentBookmark.data.academicDegreeDetail);
    } else if (isFinite(this.academicDegreeId)) {
      this.academicDegreeFacadeService.getAcademicDegree$(this.academicDegreeId)
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
      const route = `academic-degree/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: IAcademicDegreeViewModel): void {
    this.validator.setDto(value);
    this.academicDegree = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.academicDegree);

    if (this.validator.dtoValidationResult.isValid) {
      this.academicDegreeFacadeService.updateAcademicDegree$(this.academicDegree)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('ACADEMIC_DEGREE.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialAcademicDegreeValidator = this.academicDegreeValidationService.getAcademicDegreeValidator();

    if (!isNil(this.currentBookmark.viewState.academicDegreeValidator)) {
      initialAcademicDegreeValidator.initValidatorResultStates(this.currentBookmark.viewState.academicDegreeValidator);
    }

    this.currentBookmark.viewState.academicDegreeValidator = initialAcademicDegreeValidator;
    this.validator = this.currentBookmark.viewState.academicDegreeValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.academicDegree.name ?? (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/academic-degree/new`;
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
    this.academicDegree = cloneDeep(this.bookmarkService.getCurrentDataItem().academicDegreeDetailCopy);
    this.bookmarkService.getCurrentDataItem().academicDegreeDetail = this.academicDegree;
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
      .setVisibility(!this.academicDegree.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.academicDegree.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.academicDegree.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.academicDegree.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.academicDegree.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.academicDegree.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.academicDegreeFacadeService.refreshDetails$.next();
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
