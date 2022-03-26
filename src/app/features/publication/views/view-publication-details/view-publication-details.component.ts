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
import {PublicationMapperService} from '../../services/publication-mapper.service';
import {PublicationFacadeService} from '../../services/publication-facade.service';
import {PublicationValidationService} from '../../services/publication-validation.service';
import {IPublicationViewModel} from '../../types/view-model/publication-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {IPublicationDetailsViewState} from '../../types/view-model/publication-details-view-state';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';

@Component({
  selector: 'cr-view-publication-details',
  templateUrl: './view-publication-details.component.html',
  styleUrls: ['./view-publication-details.component.scss']
})
export class ViewPublicationDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public publicationId: number;
  public publication: IPublicationViewModel;
  public titleValue = '';
  public isNew = false;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: IPublicationDetailsViewState;
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
    protected publicationValidationService: PublicationValidationService,
    private publicationFacadeService: PublicationFacadeService,
    private publicationMapperService: PublicationMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.publicationDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initTitleHeaderButtons();
    this.initDropdowns();

    if (this.document.location.pathname.endsWith('publication/new')) {
      this.isNew = true;
    } else {
      this.publicationId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.publicationFacadeService.getPublicationDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  initDropdowns() {
    this.getTeacherDropdownList = this.publicationFacadeService.getTeacherDropdownList$.bind(this.publicationFacadeService);
  }

  get teacherIds() {
    return this.publication.teachers.map(el => el.id);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.publicationFacadeService.refreshDetails$
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
    return !isEqual(this.currentBookmark.data.publicationDetail, this.currentBookmark.data.publicationDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.publication);
    if (this.validator.dtoValidationResult.isValid) {
      this.publicationFacadeService.createPublication$(this.publication)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('PUBLICATION.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.publicationFacadeService.deletePublication$(this.publication)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().publicationDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().publicationDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService
                .instant('PUBLICATION.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.publicationDetail)) {
      this.currentBookmark.data.publicationDetail = this.publicationMapperService.publicationInitializeViewModel();
      this.currentBookmark.data.publicationDetailCopy = cloneDeep(this.currentBookmark.data.publicationDetail);
      this.setData(this.currentBookmark.data.publicationDetail);
    } else if (isFinite(this.publicationId)) {
      this.publicationFacadeService.getPublication$(this.publicationId)
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
      const route = `publication/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: IPublicationViewModel): void {
    this.validator.setDto(value);
    this.publication = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.publication);

    if (this.validator.dtoValidationResult.isValid) {
      this.publicationFacadeService.updatePublication$(this.publication)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('PUBLICATION.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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
    const initialPublicationValidator = this.publicationValidationService.getPublicationValidator();

    if (!isNil(this.currentBookmark.viewState.publicationValidator)) {
      initialPublicationValidator.initValidatorResultStates(this.currentBookmark.viewState.publicationValidator);
    }

    this.currentBookmark.viewState.publicationValidator = initialPublicationValidator;
    this.validator = this.currentBookmark.viewState.publicationValidator;
  }

  // endregion

  // region Event handler
  changeTitle(): void {
    this.titleValue = this.publication.title || (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/publication/new`;
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
    this.publication = cloneDeep(this.bookmarkService.getCurrentDataItem().publicationDetailCopy);
    this.bookmarkService.getCurrentDataItem().publicationDetail = this.publication;
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
      .setVisibility(!this.publication.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.publication.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.publication.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.publication.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.publication.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.publication.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.publicationFacadeService.refreshDetails$.next();
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
