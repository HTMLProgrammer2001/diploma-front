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
import {ExportFacadeService} from '../../services/export-facade.service';
import {IGenerateReportFilterViewModel} from '../../types/view-model/generate-report-filter-view-model';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {ExportValidationService} from '../../services/export-validation.service';
import {downloadByUrl} from '../../../../shared/utils';
import {ValidationRule} from '../../../../shared/types/validation/validation-rule';
import {ValidationTypes} from '../../../../shared/types/validation/validation-types';

export enum ExportFilterTypeEnum {
  ALL = 1,
  COMMISSION = 2,
  DEPARTMENT = 3,
  TEACHERS = 4
}

@Component({
  selector: 'cr-view-export',
  templateUrl: './view-export.component.html',
  styleUrls: ['./view-export.component.scss']
})
export class ViewExportComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public filter: IGenerateReportFilterViewModel;
  public exportTypes: Array<IdNameSimpleItem> = [];
  public ExportFilterTypeEnum = ExportFilterTypeEnum;
  public filterTypes: Array<IdNameSimpleItem> = [
    {
      id: ExportFilterTypeEnum.ALL,
      name: 'EXPORT.FILTER.TYPES.ALL'
    },
    {
      id: ExportFilterTypeEnum.COMMISSION,
      name: 'EXPORT.FILTER.TYPES.COMMISSION'
    },
    {
      id: ExportFilterTypeEnum.DEPARTMENT,
      name: 'EXPORT.FILTER.TYPES.DEPARTMENT'
    },
    {
      id: ExportFilterTypeEnum.TEACHERS,
      name: 'EXPORT.FILTER.TYPES.TEACHERS'
    }
  ];
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private cacheInitialized: boolean;

  public getCommissionDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getCommissionDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getDepartmentDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getDepartmentDropdownItem: (id: number) => Observable<IdNameSimpleItem>;
  public getTeacherDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeacherDropdownItems: (ids: Array<number>) => Observable<Array<IdNameSimpleItem>>;

  public commissionRequiredRule: ValidationRule;
  public departmentRequiredRule: ValidationRule;
  public teachersRequiredRule: ValidationRule;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    private exportFacadeService: ExportFacadeService,
    private exportValidationService: ExportValidationService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.EXPORT.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.EXPORT.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.export,
    }, bookmarkService, router, route);

    this.cacheInitialized = !isNil(this.bookmarkService.getCurrentViewState().exportFilter);
    this.initTitleHeaderButtons();
    this.initDropdowns();
    this.initValidator();

    this.exportFacadeService.getExportFilter$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filter => {
        this.filter = filter;
        this.validator.setDto(this.filter);
      });
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    if (!this.cacheInitialized) {
      if (this.route.snapshot.queryParamMap.get('commissionId')) {
        this.filter.commissionId = Number(this.route.snapshot.queryParamMap.get('commissionId'));
      }

      if (this.route.snapshot.queryParamMap.get('departmentId')) {
        this.filter.departmentId = Number(this.route.snapshot.queryParamMap.get('departmentId'));
      }

      if (this.route.snapshot.queryParamMap.getAll('teacherIds')) {
        this.filter.teacherIds = this.route.snapshot.queryParamMap.getAll('teacherIds').map(el => Number(el));
      }

      if (this.route.snapshot.queryParamMap.getAll('select')) {
        this.filter.select = this.route.snapshot.queryParamMap.getAll('select').map(el => Number(el));
      }

      if (this.route.snapshot.queryParamMap.get('from')) {
        this.filter.from = this.route.snapshot.queryParamMap.get('from');
      }

      if (this.route.snapshot.queryParamMap.get('to')) {
        this.filter.to = this.route.snapshot.queryParamMap.get('to');
      }
    }

    this.exportFacadeService.getExportTypes$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        exportTypes => this.exportTypes = exportTypes, error => {
          const errors = this.errorService.getMessagesToShow(error.errors);

          if (!isEmpty(errors)) {
            const errorDialog = this.customNotificationService.showDialogError(errors);
            errorDialog.result.subscribe(() => this.errorService.redirectIfUnauthorized(error.errors));
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  //endregion

  // region Inits

  initValidator() {
    const initialExportValidator = this.exportValidationService.getValidator();

    if (!isNil(this.currentBookmark.viewState.exportValidator)) {
      initialExportValidator.initValidatorResultStates(this.currentBookmark.viewState.exportValidator);
    }

    this.currentBookmark.viewState.exportValidator = initialExportValidator;
    this.validator = this.currentBookmark.viewState.exportValidator;

    this.commissionRequiredRule = this.validator.getRule('commissionId', ValidationTypes.required);
    this.departmentRequiredRule = this.validator.getRule('departmentId', ValidationTypes.required);
    this.teachersRequiredRule = this.validator.getRule('teacherIds', ValidationTypes.required);
  }

  initDropdowns() {
    this.getCommissionDropdownList = this.exportFacadeService.getExportCommissionListDropdown$.bind(this.exportFacadeService);
    this.getCommissionDropdownItem = this.exportFacadeService.getExportCommissionDropdownItem$.bind(this.exportFacadeService);
    this.getDepartmentDropdownList = this.exportFacadeService.getExportDepartmentListDropdown$.bind(this.exportFacadeService);
    this.getDepartmentDropdownItem = this.exportFacadeService.getExportDepartmentDropdownItem$.bind(this.exportFacadeService);
    this.getTeacherDropdownList = this.exportFacadeService.getExportTeacherListDropdown$.bind(this.exportFacadeService);
    this.getTeacherDropdownItems = this.exportFacadeService.getExportTeacherDropdownItems$.bind(this.exportFacadeService);
  }

  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }

  // endregion

  //region Events

  generateReport() {
    this.validator.validateDto(this.filter);
    if (this.validator.dtoValidationResult.isValid) {
      this.router.navigate([], {relativeTo: this.route, queryParams: this.filter, queryParamsHandling: 'merge'});
      this.bookmarkService.getCurrentBookmarkTask().params = cloneDeep(this.filter);

      this.exportFacadeService.generateReport$(this.filter)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(
          resp => {
            const url = new URL(resp.url);
            const fileName = url.pathname.split('/').pop();
            url.searchParams.set('token', this.authService.accessToken);
            downloadByUrl(url.toString(), fileName);
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

  onSelectChange(selectId: number) {
    if (this.filter.select.includes(selectId)) {
      this.filter.select = this.filter.select.filter(el => el !== selectId);
    } else {
      this.filter.select.push(selectId);
    }
  }

  onFilterTypeChange() {
    this.filter.commissionId = null;
    this.filter.departmentId = null;
    this.filter.teacherIds = [];

    this.commissionRequiredRule.isActive = false;
    this.departmentRequiredRule.isActive = false;
    this.teachersRequiredRule.isActive = false;

    if(this.filter.type === ExportFilterTypeEnum.COMMISSION) {
      this.commissionRequiredRule.isActive = true;
    }

    if(this.filter.type === ExportFilterTypeEnum.DEPARTMENT) {
      this.departmentRequiredRule.isActive = true;
    }

    if(this.filter.type === ExportFilterTypeEnum.TEACHERS) {
      this.teachersRequiredRule.isActive = true;
    }
  }

  //endregion
}
