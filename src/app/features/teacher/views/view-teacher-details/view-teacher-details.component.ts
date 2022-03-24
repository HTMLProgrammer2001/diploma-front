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
import {TeacherMapperService} from '../../services/teacher-mapper.service';
import {TeacherFacadeService} from '../../services/teacher-facade.service';
import {TeacherValidationService} from '../../services/teacher-validation.service';
import {ITeacherViewModel} from '../../types/view-model/teacher-view-model';
import {readRoles, writeRoles} from '../../../../shared/roles';
import {ITeacherDetailsViewState} from '../../types/view-model/teacher-details-view-state';
import {ValidationResult} from '../../../../shared/types/validation/validation-result';
import {PanelBarItemModel} from '@progress/kendo-angular-layout/dist/es2015/panelbar/panelbar-item-model';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {IPaginator} from '../../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../../shared/types/id-name-simple-item';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'cr-view-teacher-details',
  templateUrl: './view-teacher-details.component.html',
  styleUrls: ['./view-teacher-details.component.scss']
})
export class ViewTeacherDetailsComponent extends BaseViewComponent
  implements OnInit, OnDestroy {
  public teacherId: number;
  public teacher: ITeacherViewModel;
  public titleValue = '';
  public isNew = false;
  public validator: Validator;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public viewState: ITeacherDetailsViewState;
  private onDestroy: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public getCommissionDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getDepartmentDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getTeachingRankDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicDegreeDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;
  public getAcademicTitleDropdownList: (paginator: IPaginatorBase) => Observable<IPaginator<IdNameSimpleItem>>;

  public personalValidationGroupResult: ValidationResult;
  public professionalValidationGroupResult: ValidationResult;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected bookmarkService: BookmarkService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    protected teacherValidationService: TeacherValidationService,
    private teacherFacadeService: TeacherFacadeService,
    private teacherMapperService: TeacherMapperService,
    public authService: AuthService) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.TEACHER.DETAILS.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.TEACHER.DETAILS.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.teacherDetails,
    }, bookmarkService, router, route);

    this.currentBookmarkTask.checkDataChanged = this.checkDataChanged.bind(this);
    this.initDropdowns();
    this.initTitleHeaderButtons();

    if (this.document.location.pathname.endsWith('teacher/new')) {
      this.isNew = true;
    } else {
      this.teacherId = Number(this.route.snapshot.paramMap.get('id'));
    }

    this.teacherFacadeService.getTeacherDetailsViewState$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(viewState => this.viewState = viewState);
  }

  //region Lifecycle hooks

  ngOnInit(): void {
    this.initValidator();
    this.getData();

    this.teacherFacadeService.refreshDetails$
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
    return !isEqual(this.currentBookmark.data.teacherDetail, this.currentBookmark.data.teacherDetailCopy);
  }

  createData(): void {
    this.validator.validateDto(this.teacher);
    if (this.validator.dtoValidationResult.isValid) {
      this.teacherFacadeService.createTeacher$(this.teacher)
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService.instant('TEACHER.DETAILS.NOTIFICATION.SUCCESS_CREATE'));
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
          this.teacherFacadeService.deleteTeacher$(this.teacher)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.bookmarkService.getCurrentDataItem().teacherDetail.isDeleted = true;
              this.bookmarkService.getCurrentDataItem().teacherDetailCopy.isDeleted = true;
              this.refreshTitleHeaderButtons();
              this.customNotificationService.showSuccess(this.translateService
                .instant('TEACHER.DETAILS.NOTIFICATION.SUCCESS_DELETE'));
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
    if (this.isNew && isNil(this.currentBookmark.data.teacherDetail)) {
      this.currentBookmark.data.teacherDetail = this.teacherMapperService.teacherInitializeViewModel();
      this.currentBookmark.data.teacherDetailCopy = cloneDeep(this.currentBookmark.data.teacherDetail);
      this.setData(this.currentBookmark.data.teacherDetail);
    } else if (isFinite(this.teacherId)) {
      this.teacherFacadeService.getTeacher$(this.teacherId)
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
      const route = `teacher/details/${id}`;
      return this.router.navigate([route]);
    });
  }

  setData(value: ITeacherViewModel): void {
    this.validator.setDto(value);
    this.teacher = value;
    this.changeTitle();
    this.refreshTitleHeaderButtons();
  }

  updateData(): void {
    this.validator.validateDto(this.teacher);

    if (this.validator.dtoValidationResult.isValid) {
      this.teacherFacadeService.updateTeacher$(this.teacher)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(value => {
          this.customNotificationService.showSuccess(this.translateService
            .instant('TEACHER.DETAILS.NOTIFICATION.SUCCESS_UPDATE'));
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

  initDropdowns() {
    this.getCommissionDropdownList = this.teacherFacadeService.getCommissionDropdownList$.bind(this.teacherFacadeService);
    this.getDepartmentDropdownList = this.teacherFacadeService.getDepartmentDropdownList$.bind(this.teacherFacadeService);
    this.getTeachingRankDropdownList = this.teacherFacadeService.getTeachingRankDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicDegreeDropdownList = this.teacherFacadeService.getAcademicDegreeDropdownList$.bind(this.teacherFacadeService);
    this.getAcademicTitleDropdownList = this.teacherFacadeService.getAcademicTitleDropdownList$.bind(this.teacherFacadeService);
  }

  initValidator(): void {
    const initialTeacherValidator = this.teacherValidationService.getTeacherValidator();

    if (!isNil(this.currentBookmark.viewState.teacherValidator)) {
      initialTeacherValidator.initValidatorResultStates(this.currentBookmark.viewState.teacherValidator);
    }

    this.currentBookmark.viewState.teacherValidator = initialTeacherValidator;
    this.personalValidationGroupResult = initialTeacherValidator.getGroupResult('personal');
    this.professionalValidationGroupResult = initialTeacherValidator.getGroupResult('professional');
    this.validator = this.currentBookmark.viewState.teacherValidator;
  }

  // endregion

  // region Event handler

  onAvatarChange(file: File) {
    if (this.teacher.avatarUrl) {
      URL.revokeObjectURL(this.teacher.avatarUrl);
    }

    if (file) {
      this.teacher.avatarUrl = URL.createObjectURL(file);
    }
    else {
      this.teacher.avatarUrl = null;
    }
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  panelStateChange(panelName: keyof ITeacherDetailsViewState['panels'], $event: Array<PanelBarItemModel>): void {
    this.viewState.panels[panelName] = $event[0].expanded;
  }

  changeTitle(): void {
    this.titleValue = this.teacher.fullName || (this.isNew ? this.translateService.instant('COMMON.NEW') : '');
    this.currentBookmarkTask.nameValue = this.titleValue;
  }

  openNewData(): Promise<boolean> {
    const route = `/teacher/new`;
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
    this.teacher = cloneDeep(this.bookmarkService.getCurrentDataItem().teacherDetailCopy);
    this.bookmarkService.getCurrentDataItem().teacherDetail = this.teacher;
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
      .setVisibility(!this.teacher.isDeleted && !this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('add')
      .setVisibility(!this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('update')
      .setVisibility(!this.isNew && !this.teacher.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('refresh')
      .setVisibility(!this.isNew && readRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('create')
      .setVisibility(this.isNew && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('delete-status')
      .setVisibility(!this.isNew && this.teacher.isDeleted);

    this.titleHeaderButtonManager.getById('restore')
      .setVisibility(!this.isNew && !this.viewState.restoring
        && this.teacher.isDeleted && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('confirm-restore')
      .setVisibility(!this.isNew && this.teacher.isDeleted && this.viewState.restoring
        && writeRoles.includes(this.authService.currentRole));

    this.titleHeaderButtonManager.getById('cancel-restore')
      .setVisibility(!this.isNew && this.teacher.isDeleted && this.viewState.restoring);
  }

  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'refresh':
        this.teacherFacadeService.refreshDetails$.next();
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
