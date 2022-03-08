import {Injectable, TemplateRef} from '@angular/core';
import {NotificationService} from '@progress/kendo-angular-notification';
import {DialogRef, DialogService} from '@progress/kendo-angular-dialog';
import {TranslateService} from '@ngx-translate/core';
import {CustomDialogResultEnum} from '../../shared/types/custom-dialog-result.enum';
import {Validator} from '../../shared/types/validation/validator';
import {ValidationDialogComponent} from '../components/validation-dialog/validation-dialog.component';
import {ErrorDialogComponent} from '../components/error-dialog/error-dialog.component';
import {ErrorViewModel} from '../../shared/types/error-view-model';
import {isEmpty, isNil} from 'lodash';
import {interpolateString} from '../../shared/utils';
import {interval} from 'rxjs';
import {map, take, takeUntil, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class CustomNotificationService {
  private dialogRefs: DialogRef[] = [];

  constructor(private notificationService: NotificationService,
              private translate: TranslateService,
              private dialogService: DialogService) {
  }

  showSuccess(message: string) {
    this.showCustom(
      message,
      2000,
      'center',
      'top',
      'fade',
      400,
      'success',
      true
    );
  }

  showError(message: string) {
    this.showCustom(
      message,
      2000,
      'right',
      'bottom',
      'fade',
      400,
      'error',
      true
    );
  }

  showWarning(message: string) {
    this.showCustom(message,
      2000,
      'right',
      'bottom',
      'fade',
      400,
      'warning',
      true);
  }

  showCustom(content: string,
             hideAfter: number,
             positionHorizontal: 'left' | 'center' | 'right',
             positionVertical: 'top' | 'bottom',
             animationType: 'slide' | 'fade',
             animationDuration: number,
             typeStyle: 'none' | 'success' | 'warning' | 'error' | 'info',
             typeIcon: boolean
  ) {
    this.notificationService.show({
      content,
      hideAfter,
      position: {horizontal: positionHorizontal, vertical: positionVertical},
      animation: {type: animationType, duration: animationDuration},
      type: {style: typeStyle, icon: typeIcon}
    });
  }

  showDialogCloseNotSaved(name: string): DialogRef {
    const dialogRef: DialogRef = this.dialogService.open({
      title: this.translate.instant('COMMON.CLOSE_NOT_SAVED_DIALOG.TITLE'), //'Delete confirmation',
      content: this.translate.instant('COMMON.CLOSE_NOT_SAVED_DIALOG.CONTENT', {name}),
      actions: [
        {
          customDialogResult: CustomDialogResultEnum.no,
          text: this.translate.instant('COMMON.BUTTON.NO')
        },
        {
          customDialogResult: CustomDialogResultEnum.yes,
          text: this.translate.instant('COMMON.BUTTON.YES'),
          primary: true
        }
      ],
      width: 450,
      height: 200,
      minWidth: 250
    });

    return this.processRef(dialogRef);
  }

  showDialogValidation(validator: Validator): DialogRef {
    const dialogRef: DialogRef = this.dialogService.open({
      title: this.translate.instant('COMMON.VALIDATION.TITLE'),
      content: ValidationDialogComponent,
      //autoFocusedElement: 'kendo-dialog-actions > button',
      actions: [
        {
          customDialogResult: CustomDialogResultEnum.ok,
          text: this.translate.instant('COMMON.BUTTON.OK'), primary: true
        }
      ],
      width: 450,
      minWidth: 250,
      maxHeight: 600
    });

    const userInfo = dialogRef.content.instance;
    userInfo.validator = validator;

    return this.processRef(dialogRef);
  }

  showDialogError(errors: Array<ErrorViewModel>): DialogRef {
    let dialogRef: DialogRef = null;
    if (!isEmpty(errors)) {
      dialogRef = this.dialogService.open({
        title: this.translate.instant('COMMON.ERROR_DIALOG.TITLE'),
        content: ErrorDialogComponent,
        actions: [
          {
            customDialogResult: CustomDialogResultEnum.ok,
            text: this.translate.instant('COMMON.BUTTON.OK'), primary: true
          }
        ],
        width: 450,
        minWidth: 250,
        maxHeight: 600
      });
      const userInfo = dialogRef.content.instance;
      userInfo.errors = errors;
    }

    return this.processRef(dialogRef);
  }

  showDialogDelete(options?: {
    title?: string;
    titleTranslateKey?: string;
    titleValue?: string;
    content?: string;
    contentTranslateKey?: string;
    contentValue?: string;
    buttonNo?: string;
    buttonNoTranslateKey?: string;
    buttonNoValue?: string;
    buttonOkay?: string;
    buttonOkayTranslateKey?: string;
    buttonOkayValue?: string;
  }): DialogRef {
    return this.show({
      title: this.getPreparedTranslateLabel(
        options?.title,
        options?.titleTranslateKey || 'COMMON.DELETE_DIALOG.TITLE',
        options?.titleValue
      ),

      content: this.getPreparedTranslateLabel(
        options?.content,
        options?.contentTranslateKey || 'COMMON.DELETE_DIALOG.CONTENT',
        options?.contentValue
      ),

      actions: [
        {
          // button No
          text: this.getPreparedTranslateLabel(
            options?.buttonNo,
            options?.buttonNoTranslateKey || 'COMMON.BUTTON.NO',
            options?.buttonNoValue
          ),
          primary: false
        }, {
          // button Yes
          text: this.getPreparedTranslateLabel(
            options?.buttonOkay,
            options?.buttonOkayTranslateKey || 'COMMON.BUTTON.YES',
            options?.buttonOkayValue
          ),
          primary: true
        }
      ],
      width: 450,
      height: 200,
    });
  }

  showInactiveDialog(inactiveSeconds: number) {
    const dialogRef = this.dialogService.open({
      title: this.translate.instant('COMMON.INACTIVE_DIALOG.TITLE'),
      content: this.translate.instant('COMMON.INACTIVE_DIALOG.CONTENT'),
      actions: [
        {
          // button No
          text: this.translate.instant('COMMON.BUTTON.NO'),
          primary: false
        }, {
          // button Yes
          text: this.translate.instant('COMMON.BUTTON.YES_INTERVAL', {value: inactiveSeconds}),
          primary: true
        }
      ],
      width: 450,
      height: 200,
    });

    interval(1000).pipe(
      map(passedSeconds => passedSeconds + 1),
      tap((passedSeconds) => {
        const yesButton = dialogRef.dialog.instance.actions.find(btn => btn.primary);
        yesButton.text = this.translate.instant('COMMON.BUTTON.YES_INTERVAL', {value: inactiveSeconds - passedSeconds});
      }),
      take(inactiveSeconds),
      takeUntil(dialogRef.result)
    ).subscribe(null, null, () => {
      dialogRef.close();
    });

    return this.processRef(dialogRef);
  }

  show(options: CustomDialogOptions): DialogRef {
    // buttons
    options?.actions?.forEach(button => {
      button.text = this.getPreparedTranslateLabel(
        button.text,
        button.textTranslateKey || 'COMMON.BUTTON.CLOSE',
        button.textTranslateValue
      );
    });

    // header title
    options.title = this.getPreparedTranslateLabel(
      options.title,
      options.titleTranslateKey,
      options.titleTranslateValue
    );

    // content
    const content = options?.contentTemplateRef
      ? options.contentTemplateRef
      : this.getPreparedTranslateLabel(
        options.content,
        options.contentTranslateKey,
        options.contentTranslateValue
      );

    // dialog window
    const dialogRef: DialogRef = this.dialogService.open({
      title: options.title,
      content,
      actions: options?.actions,
      width: options?.width,
      height: options?.height,
      minWidth: options?.minWidth,
      minHeight: options?.minHeight,
      maxHeight: options?.maxHeight
    });

    return this.processRef(dialogRef);
  }

  closeDialogs() {
    this.dialogRefs.forEach(ref => ref.close());
  }

  private getPreparedTranslateLabel(
    title: string,
    translateKey: string,
    translateValue: string,
    defaultValue?: string
  ): string {
    return !!title
      ? interpolateString(title, {value: translateValue})
      : (!!translateKey
        ? this.translate.instant(translateKey, {value: translateValue})
        : defaultValue);
  }

  private processRef(dialogRef: DialogRef): DialogRef {
    if (!isNil(dialogRef)) {
      this.dialogRefs.push(dialogRef);
      dialogRef.result.subscribe(_ => this.dialogRefs = this.dialogRefs.filter(ref => ref !== dialogRef));
    }

    return dialogRef;
  }

  showNoInternetConnection(): DialogRef {
    const dialog = this.dialogRefs.find(x => x.content.instance.noInternetConnection);

    if (dialog) {
      return dialog;
    }

    let dialogRef: DialogRef = null;
    dialogRef = this.dialogService.open({
      title: this.translate.instant('COMMON.NETWORK.DISCONNECT_ERROR_TITLE'),
      content: ErrorDialogComponent,
      actions: [
        {
          customDialogResult: CustomDialogResultEnum.ok,
          text: this.translate.instant('COMMON.BUTTON.OK'), primary: true
        }
      ],
      width: 450,
      minWidth: 250,
      maxHeight: 600,
    });

    dialogRef.content.instance.errors = [{message: this.translate.instant('COMMON.NETWORK.DISCONNECT_ERROR_MESSAGE')}];
    dialogRef.content.instance.noInternetConnection = true;

    return this.processRef(dialogRef);
  }
}

interface CustomDialogOptions {
  actions?: CustomDialogAction[];
  title?: string;
  titleTranslateKey?: string;
  titleTranslateValue?: string;
  content?: string;
  contentTranslateKey?: string;
  contentTranslateValue?: string;
  contentTemplateRef?: TemplateRef<any>;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

interface CustomDialogAction {
  text?: string;
  textTranslateKey?: string;
  textTranslateValue?: string;
  primary?: boolean;
  customDialogResult?: CustomDialogResultEnum;
}
