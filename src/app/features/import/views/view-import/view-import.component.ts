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
import {takeUntil} from 'rxjs/operators';
import {ImportFacadeService} from '../../services/import-facade.service';
import {IImportBodyViewModel} from '../../types/view-model/import-body-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {cloneDeep, isEmpty, isEqual, isNil} from 'lodash';
import {ImportValidationService} from '../../services/import-validation.service';
import {ImportMapperService} from '../../services/import-mapper.service';
import {IImportErrorViewModel} from '../../types/view-model/import-error-view-model';
import {downloadByUrl} from '../../../../shared/utils';

@Component({
  selector: 'cr-view-import',
  templateUrl: './view-import.component.html',
  styleUrls: ['./view-import.component.scss']
})
export class ViewImportComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public importBody: IImportBodyViewModel;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private cacheInitialized: boolean;

  public getImportTypeDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getImportTypeDropdownItem: (id: number) => Observable<IdNameSimpleItem>;

  public importErrors: Array<IImportErrorViewModel> = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    private importFacadeService: ImportFacadeService,
    private importMapperService: ImportMapperService,
    private importValidationService: ImportValidationService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.IMPORT.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.IMPORT.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.import,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentDataItem().importBody);
    this.initTitleHeaderButtons();
    this.initDropdowns();
    this.initValidator();

    this.importFacadeService.getImportBody$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(importBody => {
        this.importBody = importBody;
        this.validator.setDto(this.importBody);
      });

    this.importFacadeService.getImportErrors$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(errors => this.importErrors = errors);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('type')) {
        this.importBody.type = Number(this.route.snapshot.queryParamMap.get('type'));
      }

      if (this.route.snapshot.queryParamMap.get('from')) {
        this.importBody.from = Number(this.route.snapshot.queryParamMap.get('from'));
      }

      if (this.route.snapshot.queryParamMap.get('to')) {
        this.importBody.to = Number(this.route.snapshot.queryParamMap.get('to'));
      }

      if (this.route.snapshot.queryParamMap.get('ignoreErrors')) {
        this.importBody.ignoreErrors = this.route.snapshot.queryParamMap.get('ignoreErrors') === 'true';
      }
    }
  }

  ngOnDestroy(): void {
    this.currentBookmarkTask.isDataChanged = this.checkDataChanged();
    this.currentBookmarkTask.checkDataChanged = null;
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  //endregion

  // region Inits

  initValidator() {
    const initialImportValidator = this.importValidationService.getValidator();

    if (!isNil(this.currentBookmark.viewState.importValidator)) {
      initialImportValidator.initValidatorResultStates(this.currentBookmark.viewState.importValidator);
    }

    this.currentBookmark.viewState.importValidator = initialImportValidator;
    this.validator = this.currentBookmark.viewState.importValidator;
  }

  initDropdowns() {
    this.getImportTypeDropdownList = this.importFacadeService.getImportTypeDropdownList$.bind(this.importFacadeService);
    this.getImportTypeDropdownItem = this.importFacadeService.getImportTypeDropdownItem$.bind(this.importFacadeService);
  }

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  // endregion

  //region Events

  checkDataChanged(): boolean {
    return !isEqual(this.currentBookmark.data.importBody, this.importMapperService.initializeImportBodyViewModel());
  }

  generateImportTemplate() {
    this.importFacadeService.importTemplateGenerate$(this.importBody.type)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(resp => {
        const url = new URL(resp.url);
        const fileName = url.pathname.split('/').pop();
        url.searchParams.set('token', this.authService.accessToken);
        downloadByUrl(url.toString(), fileName);
      });
  }

  importData() {
    this.importErrors = [];
    this.bookmarkService.getCurrentDataItem().importErrors = [];

    this.router.navigate([], {relativeTo: this.route, queryParams: this.importBody, queryParamsHandling: 'merge'});
    this.bookmarkService.getCurrentBookmarkTask().params = cloneDeep(this.importBody);

    this.validator.validateDto(this.importBody);
    if (this.validator.dtoValidationResult.isValid) {
      this.importFacadeService.importData$(this.importBody)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          resp => {
            if (resp.result) {
              this.customNotificationService.showSuccess(this.translateService.instant('IMPORT.NOTIFICATION.SUCCESS_IMPORT'));
            } else {
              this.customNotificationService.showError(this.translateService.instant('IMPORT.NOTIFICATION.ERROR_IMPORT'));
            }

            this.importErrors = resp.errors || [];
          },
          error => {
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

  //endregion
}
