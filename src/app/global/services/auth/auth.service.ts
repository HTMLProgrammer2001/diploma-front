import {Injectable} from '@angular/core';
import {ILoginViewModel} from '../../types/auth/login-view-model';
import {Observable, of, Subscription, throwError, timer} from 'rxjs';
import {AuthApiService} from './auth-api-service';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {IResponse} from '../../../shared/types/response';
import jwtDecode from 'jwt-decode';
import {finalize, map, mapTo, share, switchMap, take, tap} from 'rxjs/operators';
import {AccessTokenModel} from '../../types/auth/access-token-model';
import {Status} from '../../types/status';
import {isNil} from 'lodash';
import {ConfigService} from '../config/config.service';
import {Config} from '../../types/config';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../bookmark/bookmark.service';
import {CustomNotificationService} from '../custom-notification.service';
import {IRefreshTokenModel} from '../../types/auth/refresh-token-model';
import {RequestConfig} from '../../types/request-config';
import {IError} from '../../../shared/types/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public config: Config = null;
  public lastActivityTime: Date;
  public accessTokenModel: AccessTokenModel = null;
  public refreshTokenModel: IRefreshTokenModel = null;
  private _offsetTime = 60000;
  private updateRequest$: Observable<IResponse<AuthViewModel>>;
  private _deltaServerLocalTime = 0;
  private _authUserEmail = 'auth-user-email';
  private _authAccessToken = 'auth-access-token';
  private _authRefreshToken = 'auth-refresh-token';

  private _checkSubscription: Subscription;
  private _checkLogoffIntervalSeconds: Observable<any>;
  private _authViewModel: AuthViewModel = new AuthViewModel();

  constructor(
    private notificationService: CustomNotificationService,
    private authApiService: AuthApiService,
    private configService: ConfigService,
    public bookmarksService: BookmarkService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    window.addEventListener('storage', event => {
      if (event.key === this._authAccessToken && !localStorage.getItem(this._authAccessToken)) {
        this.closeBookmarks();
        this.notificationService.closeDialogs();

        this.authViewModel = new AuthViewModel();
        localStorage.removeItem(this._authUserEmail);
        localStorage.removeItem(this._authAccessToken);
        localStorage.removeItem(this._authRefreshToken);

        this.router.navigate(['/login'], {
          queryParams: {...this.route.root.queryParams, redirect: this.router.url.split('?')[0]},
          queryParamsHandling: 'merge'
        });
      }
    });

    this.config = configService.getConfig();

    if (this.isAuthenticated()) {
      this.lastActivityTime = new Date();
      this.startLogoffTimer();
    }
  }

  get currentRole() {
    return this.accessTokenModel?.role;
  }

  get authViewModel() {
    return this._authViewModel;
  }

  set authViewModel(model: AuthViewModel) {
    this._authViewModel = model;
  }

  get accessToken(): string {
    if (!isNil(this.authViewModel.accessToken)) {
      return this.authViewModel.accessToken;
    } else {
      try {
        this._authViewModel.accessToken = localStorage.getItem(this._authAccessToken);
        this._authViewModel.refreshToken = localStorage.getItem(this._authRefreshToken);
      } catch {
        this.closeBookmarks();

        this.router.navigate(['/login'], {
          queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
          queryParamsHandling: 'merge'
        });
      }
      if (!isNil(this.authViewModel.accessToken) && !isNil(this.authViewModel.accessToken)) {
        this.updateToken(this.authViewModel);
      }
      return this.authViewModel?.accessToken;
    }
  }

  get userId(): number {
    if (isNil(this.accessToken)) {
      return null;
    }

    return this.accessTokenModel?.userId;
  }

  get dateNow(): Date {
    return new Date(Date.now() + Math.abs(this._deltaServerLocalTime) + this._offsetTime);
  }

  public startTimerAfterLogin() {
    this.lastActivityTime = new Date();
    this.startLogoffTimer();
  }

  public startLogoffTimer() {
    this._checkLogoffIntervalSeconds = timer(this.config.checkLogoffIntervalSeconds * 1000);
    this._checkSubscription = this._checkLogoffIntervalSeconds.subscribe(() => {
      console.log(`Check logoff - ${this.config.inactivityPeriodMinutes} min :
      ${this.config.inactivityPeriodMinutes * 60 - (Number(new Date()) - Number(this.lastActivityTime)) / 1000} seconds left`);

      if (Number(new Date()) - Number(this.lastActivityTime) >= this.config.inactivityPeriodMinutes * 60 * 1000) {
        console.log('Expired');

        const dialogRef = this.notificationService.showInactiveDialog(this.config.answerPeriodSeconds);
        dialogRef.result.subscribe((result: any) => {
          if (!result.primary) {
            this.notificationService.closeDialogs();

            this.router.navigate(['/login'], {
              queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
              queryParamsHandling: 'merge'
            });
          } else {
            this.lastActivityTime = new Date();
            this.restartLogoffTimer();
          }
        });
      } else {
        this.restartLogoffTimer();
      }
    });
  }

  public stopLogoffTimer() {
    if (this._checkSubscription) {
      this._checkSubscription.unsubscribe();
    }

    this._checkLogoffIntervalSeconds = null;
  }

  public restartLogoffTimer() {
    this.stopLogoffTimer();
    this.startLogoffTimer();
  }

  public login(user: ILoginViewModel): Observable<IResponse<AuthViewModel>> {
    return this.authApiService.login$(user).pipe(
      tap(value => {
        if (value.status === Status.ok) {
          try {
            this.updateToken(value.data);
            this.startTimerAfterLogin();

            const userEmail = localStorage.getItem(this._authUserEmail);
            if (userEmail !== user.email) {
              this.closeBookmarks();

              this.router.navigate(['/login'], {
                queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
                queryParamsHandling: 'merge'
              });
            }
          } catch {
            this.closeBookmarks();
          }
        }
      }),
    );
  }

  public logout() {
    return this.authApiService.logout$(this.authViewModel.refreshToken).pipe(
      finalize(() => {
        this.closeBookmarks();

        this.authViewModel = new AuthViewModel();
        localStorage.removeItem(this._authUserEmail);
        localStorage.removeItem(this._authAccessToken);
        localStorage.removeItem(this._authRefreshToken);

        this.router.navigate(['/login'], {
          queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
          queryParamsHandling: 'merge'
        });
      })
    );
  }

  public cleanAuthState() {
    this.cleanLocalStorageData();
    this.refreshTokenModel = this.accessTokenModel = null;
    this._authViewModel = new AuthViewModel();
  }

  closeBookmarks(): Observable<void> {
    return this.bookmarksService.deleteBookmarkAll()
      .pipe(
        switchMap(value => this.bookmarksService.deleteBookmarkById(value.id)),
        mapTo(null)
      );
  }

  refreshToken(): Observable<IResponse<AuthViewModel>> {
    if (!this.updateRequest$) {
      this.updateRequest$ = this.authApiService.refreshToken$(this.authViewModel.refreshToken)
        .pipe(
          share(),
          take(1),
          tap(token => this.updateToken(token.data)),
          finalize(() => this.updateRequest$ = null)
        );
    }

    return this.updateRequest$;
  }

  isAuthenticated(): boolean {
    return !isNil(this.accessToken);
  }

  isExpiredAccessToken(): boolean {
    return this.dateNow >= new Date(this.accessTokenModel.exp * 1000);
  }

  isExpiredRefreshToken(): boolean {
    return this.dateNow >= new Date(this.refreshTokenModel.exp * 1000);
  }

  refreshTokenIfNeed(): void {
    const diffTime = Math.abs(this.dateNow.getTime() - this.accessTokenModel.exp);
    const isNeedRefresh = Math.round(diffTime / 60000) < 2;

    if (isNeedRefresh) {
      this.refreshToken().subscribe();
    }
  }

  updateToken(authViewModel: AuthViewModel) {
    try {
      this.accessTokenModel = jwtDecode<AccessTokenModel>(authViewModel.accessToken);
      this.refreshTokenModel = jwtDecode<IRefreshTokenModel>(authViewModel.refreshToken);
    } catch {
      this.closeBookmarks();
      this.notificationService.closeDialogs();

      this.router.navigate(['/login'], {
        queryParams: {...this.route.snapshot.queryParams, redirect: this.router.url.split('?')[0]},
        queryParamsHandling: 'merge'
      });
    }

    this.calculateDeltaServerLocalTime();
    this.authViewModel = {...authViewModel};
    this.updateLocalStorageData();
  }

  private updateLocalStorageData() {
    if (!isNil(this.authViewModel.accessToken)) {
      localStorage.setItem(this._authAccessToken, this.authViewModel.accessToken);
    } else {
      localStorage.removeItem(this._authAccessToken);
    }

    if (!isNil(this.authViewModel.refreshToken)) {
      localStorage.setItem(this._authRefreshToken, this.authViewModel.refreshToken);
    } else {
      localStorage.removeItem(this._authRefreshToken);
    }

    if (!isNil(this.accessTokenModel?.email)) {
      localStorage.setItem(this._authUserEmail, this.accessTokenModel.email);
    } else {
      localStorage.removeItem(this._authUserEmail);
    }
  }

  private cleanLocalStorageData() {
    localStorage.removeItem(this._authAccessToken);
    localStorage.removeItem(this._authRefreshToken);
  }

  private calculateDeltaServerLocalTime() {
    this._deltaServerLocalTime = Math.floor((Date.now() - this.accessTokenModel.iat * 1000));
  }

  public checkAuthorization(requestConfig: RequestConfig): Observable<Record<string, string>> {
    this.lastActivityTime = new Date();
    if (requestConfig.isAuthorize) {
      if (!isNil(requestConfig.roles) && !requestConfig.roles.includes(this.accessTokenModel.role)) {
        const error = {errors: new Array<IError>()};
        error.errors.push({code: 17, message: 'No permission'});
        return throwError(error);
      }

      if (this.isAuthenticated()) {
        this.refreshTokenIfNeed();

        if (this.isExpiredAccessToken()) {
          if (this.isExpiredRefreshToken()) {
            const error = {errors: new Array<IError>()};
            error.errors.push({code: 19, message: 'Token expired'});
            return throwError(error);
          } else {
            return this.refreshToken().pipe(map(() => ({authorization: this.accessToken})));
          }
        } else {
          return of({authorization: this.accessToken});
        }
      } else {
        const error = {errors: new Array<IError>()};
        error.errors.push({code: 19, message: 'Token expired'});
        return throwError(error);
      }
    } else {
      return of({});
    }
  }
}
