import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ElementRef, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
// @ts-ignore
import extractFiles from 'extract-files/extractFiles.mjs';
// @ts-ignore
import isExtractable from 'extract-files/isExtractableFile.mjs';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './shared/shared.module';
import {LayoutModule} from './layout/layout.module';
import {ApiHttpInterceptor} from './global/services/http.interceptor';
import {BookmarkService} from './global/services/bookmark/bookmark.service';
import {BaseViewComponent} from './global/components/base-view/base-view.component';
import {DialogModule, DialogsModule, WindowModule} from '@progress/kendo-angular-dialog';
import {NOTIFICATION_CONTAINER, NotificationModule} from '@progress/kendo-angular-notification';
import {PreloaderComponent} from './global/components/preloader/preloader.component';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LanguageService} from './global/services/language.service';
import {MessageService} from '@progress/kendo-angular-l10n';
import {MenuModule} from '@progress/kendo-angular-menu';
import {ValidationDialogComponent} from './global/components/validation-dialog/validation-dialog.component';
import {ErrorService} from './global/services/error.service';
import {ErrorDialogComponent} from './global/components/error-dialog/error-dialog.component';
import '@progress/kendo-angular-intl/locales/ru/all';
import '@progress/kendo-angular-intl/locales/uk/all';
import {ErrorsModule} from './global/components/errors/errors.module';
import {CldrIntlService, IntlService} from '@progress/kendo-angular-intl';
import {AuthService} from './global/services/auth/auth.service';
import {CustomNotificationService} from './global/services/custom-notification.service';
import {GraphqlCommonService} from './global/services/graphql-common.service';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {InMemoryCache} from '@apollo/client/core';
import {ConfigService} from './global/services/config/config.service';
import {LoggerService} from './global/services/logger.service';

export const createTranslateLoader = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + Date.now());

export class MissingTranslationService implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): string {
    return `WARN: '${params.key}' is missing in '${params.translateService.currentLang}' locale`;
  }
}

export const bookmarkProviderFactory = (provider: BookmarkService): any => () => provider.load().toPromise();

@NgModule({
  declarations: [
    AppComponent,
    BaseViewComponent,
    PreloaderComponent,
    ValidationDialogComponent,
    ErrorDialogComponent,
  ],
  imports: [
    ApolloModule,
    LayoutModule,
    ErrorsModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DialogsModule,
    NotificationModule,
    DialogModule,
    WindowModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MissingTranslationService},
    }),
    MenuModule,
  ],
  providers: [
    LanguageService,
    TranslateService,
    GraphqlCommonService,
    {provide: HTTP_INTERCEPTORS, useClass: ApiHttpInterceptor, multi: true},
    {provide: NOTIFICATION_CONTAINER, useFactory: () => ({nativeElement: document.body} as ElementRef)},
    {provide: MessageService, useClass: LanguageService},
    {provide: ErrorService, useClass: ErrorService},
    {provide: APP_INITIALIZER, useFactory: bookmarkProviderFactory, deps: [BookmarkService], multi: true},
    {provide: LOCALE_ID, useValue: 'en'},
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, configService: ConfigService) => ({
        cache: new InMemoryCache(),
        link: new LoggerService().concat(httpLink.create({
          uri: configService.getConfig().apiUrl,
          extractFiles: body => extractFiles(body, isExtractable)
        })),
      }),
      deps: [HttpLink, ConfigService],
    }
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private authService: AuthService,
    private intlService: IntlService,
    private customNotificationService: CustomNotificationService,
    private errorService: ErrorService,
  ) {
    this.translate.currentLang = '';

    this.languageService.getDefaultLanguage$().subscribe(lang => {
        this.translate.use(lang.code);
        (this.intlService as CldrIntlService).localeId = lang.code;
      },
      error => {
        this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors));
      });
  }
}
