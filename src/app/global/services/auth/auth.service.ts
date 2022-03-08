import {Injectable, isDevMode} from '@angular/core';
import {User} from '../../types/auth/user';
import {Observable, of, Subscription, throwError, timer} from 'rxjs';
import {AuthApiService} from './auth-api-service';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {IResponse} from '../../../shared/types/response';
import jwtDecode from 'jwt-decode';
import {finalize, map, share, take, tap} from 'rxjs/operators';
import {TokenModel} from '../../types/auth/token-model';
import {Status} from '../../../shared/constants/status';
import {isNil} from 'lodash';
import {RequestConfig} from '../../types/request-config';
import {HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import {IError} from '../../../shared/types/error';
import {Config} from '../../types/config';
import {RestMethods} from '../../types/rest-methods';
import {IPermission, IServices} from '../../types/auth/services';
import {IErrorAuth} from '../../types/auth/error-auth';
import {Router} from '@angular/router';
import {BookmarkService} from '../bookmark.service';
import {CustomNotificationService} from '../custom-notification.service';

const PERMIT_ALL = 'PermitAll';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: User = new User();
  public config: Config = null;
  public endpointConfiguration: IServices = null;
  public _authUserLogin = 'auth-user-login';
  public _authUserFirstName = 'auth-user-first-name';
  public _authUserLastName = 'auth-user-last-name';
  public _authUserCompanyName = 'auth-user-company-name';
  public lastActivityTime: Date;
  public currentCompanyName: string;
  private updateRequest$: Observable<IResponse<AuthViewModel>>;
  private _accessTokenModel: TokenModel = null;
  private _refreshTokenModel: TokenModel = null;
  private _offsetTime = 60000;
  private _deltaServerLocalTime = 0;
  private _authSessionId = 'auth-session-id';
  private _authAccessToken = 'auth-access-token';
  private _authRefreshToken = 'auth-refresh-token';

  private _checkSubscription: Subscription;
  private _checkLogoffIntervalSeconds: Observable<any>;

  constructor(
    private notificationService: CustomNotificationService,
    private authApiService: AuthApiService,
    private configService: ConfigService,
    public bookmarksService: BookmarkService,
    private router: Router) {
    window.addEventListener('storage', event => {
      if (event.key === this._authAccessToken && !localStorage.getItem(this._authAccessToken)) {
        this.closeBookmarks();
        this.notificationService.closeDialogs();
        router.navigate(['/login']);
      }
    });
    this.config = configService.getConfig();
    this.initializePermissions();

    if (this.isAuthenticated()) {
      this.lastActivityTime = new Date();
      this.startLogoffTimer();
    }
  }

  private _authViewModel: AuthViewModel = new AuthViewModel();

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
        this._authViewModel.sessionId = localStorage.getItem(this._authSessionId);
        this.user.login = localStorage.getItem(this._authUserLogin);
        this.user.firstName = localStorage.getItem(this._authUserFirstName);
        this.user.lastName = localStorage.getItem(this._authUserLastName);
        //this.user.companyName = localStorage.getItem(this._authUserCompanyName);
        this.currentCompanyName = localStorage.getItem(this._authUserCompanyName);
      } catch {
        this.closeBookmarks();
        this.router.navigate(['/login']);
      }
      if (!isNil(this.authViewModel.accessToken) && !isNil(this.authViewModel.accessToken)) {
        this.updateToken(this.authViewModel, this.user);
      }
      return this.authViewModel?.accessToken;
    }
  }

  get sessionId(): string {
    try {
      this.authViewModel.sessionId = localStorage.getItem(this._authSessionId);
    } catch {
      this.closeBookmarks();
      this.router.navigate(['/login']);
    }
    return this.authViewModel.sessionId;
  }

  get userId(): number {
    if (isNil(this.accessToken)) {
      return null;
    }

    return this._accessTokenModel?.uid;
  }

  get companies(): Array<any> {
    return this.authViewModel ? this.authViewModel.companies : new Array<any>();
  }

  set companies(companies: Array<any>) {
    this.authViewModel.companies = companies;
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
            //this.cleanAuthStateForLock();
            this.notificationService.closeDialogs();
            this.router.navigate(['/login']);
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

  public recalculateEndpointConfiguration() {
    for (const serviceNameKey of Object.keys(this.endpointConfiguration)) {
      for (const controllerName of Object.values(this.endpointConfiguration[serviceNameKey])) {
        for (const permission of Object.values(controllerName)) {
          const serverAccessList = (this._accessTokenModel.authorities[serviceNameKey] as string)?.replace(/\s/g, '').split(',');
          if ((!isNil(serverAccessList) && serverAccessList.includes((permission as IPermission).code))
            || (permission as IPermission).code === PERMIT_ALL) {
            (permission as IPermission).isAccessGranted = true;
          } else if (!isNil(serverAccessList) && serverAccessList.includes(`${(permission as IPermission).code}_L`)) {
            (permission as IPermission).restrictByLicense = false;
          } else {
            (permission as IPermission).isAccessGranted = false;
            (permission as IPermission).restrictByLicense = true;
          }
        }
      }
    }
  }

  public mapAccessToObject(obj: any, serviceName: string) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      const serverAccessList = (this._accessTokenModel.authorities[serviceName] as string)?.replace(/\s/g, '').split(',');
      if (typeof obj[key] === 'object') {
        this.mapAccessToObject(obj[key], serviceName);
      } else {
        if (!isNil(serverAccessList) && serverAccessList.findIndex(element => element === obj.code) !== -1) {
          obj.isAccessGranted = true;
        } else if (!isNil(serverAccessList) && serverAccessList.findIndex(element => element === `${obj.code}_L`) !== -1) {
          obj.restrictByLicense = false;
        }
        break;
      }
    }
  }

  login(user: User): Observable<IResponse<AuthViewModel>> {
    return this.authApiService.login$(user).pipe(
      tap(value => {
        this.user = user;
        if (value.status === Status.ok) {
          if (value.data.companies && value.data.companies.length === 1) {
            this.currentCompanyName = value.data.companies[0].name;
            try {
              const userLogin = localStorage.getItem(this._authUserLogin);
              delete this.user.password;
              if (userLogin !== user.login) {
                this.closeBookmarks();
                this.router.navigate(['/login']);
              }
            } catch {
              this.closeBookmarks();
            }
          }
        }
      }),
    );
  }

  logout() {
    return this.authApiService.logout$(this.sessionId).pipe(
      finalize(() => {
        this.closeBookmarks();
        localStorage.removeItem(this._authUserLogin);
        this.currentCompanyName = null;
        this.router.navigate(['/login']);
      })
    );
  }

  // cleanAuthStateForLock(){
  //   localStorage.removeItem(this._authAccessToken);
  //   localStorage.removeItem(this._authRefreshToken);
  //   localStorage.removeItem(this._authSessionId);
  // }

  cleanAuthState() {
    this.cleanLocalStorageData();
    this._refreshTokenModel = this._accessTokenModel = null;
    this.user = new User();
    this._authViewModel = new AuthViewModel();
    this.initializePermissions();
  }

  closeBookmarks(): Observable<any> {
    this.bookmarksService.deleteBookmarkAll().subscribe(value => this.bookmarksService.deleteBookmarkById(value.id));
    return of(null);
  }

  refreshToken(): Observable<IResponse<AuthViewModel>> {
    if (!this.updateRequest$) {
      this.updateRequest$ = this.authApiService.refreshToken$({
        login: localStorage.getItem(this._authUserLogin),
        refreshToken: this.authViewModel.refreshToken,
      }).pipe(
        share(),
        take(1),
        tap(token => this.updateToken(token.data, this.user)),
        finalize(() => this.updateRequest$ = null)
      );
    }

    return this.updateRequest$;
  }

  isAuthenticated(): boolean {
    return !isNil(this.accessToken);


    //return !isNil(this.accessToken);


    // if(!isNil(this.token)) {
    //   if(!this.isExpiredAccessToken()) {
    //     return true;
    //   } else if(!this.isExpiredRefreshToken()) {
    //     await this.refreshToken().subscribe(value => {
    //       if (value.status === Status.ok) {
    //         // eslint-disable-next-line no-underscore-dangle
    //         this._authViewModel = value.data;
    //         // eslint-disable-next-line no-underscore-dangle
    //         this._accessTokenModel = jwtDecode<TokenModel>(value.data.accessToken);
    //         this.setTokenLocalStorage(value.data.accessToken, value.data.refreshToken);
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     });
    //   }
    // } else {
    //   return false;
    // }
  }

  isExpiredAccessToken(): boolean {
    // console.log('Access Delta Server Local Time ms', this._deltaServerLocalTime);
    // console.log('Access dateNow', this.dateNow, '-----', new Date(this.dateNow));
    // console.log('Access exp', this._accessTokenModel.exp * 1000, '-----', new Date(this._accessTokenModel.exp * 1000));
    return this.dateNow >= new Date(this._accessTokenModel.exp * 1000);
  }

  isExpiredRefreshToken(): boolean {
    // console.log('RefreshToken Delta Server Local Time ms', this._deltaServerLocalTime);
    // console.log('RefreshToken dateNow', this.dateNow, '-----', new Date(this.dateNow));
    // console.log('RefreshToken exp', this._refreshTokenModel.exp * 1000, '-----', new Date(this._refreshTokenModel.exp * 1000));
    return this.dateNow >= new Date(this._refreshTokenModel.exp * 1000);
  }

  refreshTokenIsNeed(): void {
    const diffTime = Math.abs(this.dateNow.getTime() - this._accessTokenModel.exp);
    const isNeedRefresh = Math.round(diffTime / 60000) < 2;
    if (isNeedRefresh) {
      this.refreshToken().subscribe();
    }
  }

  updateToken(authViewModel: AuthViewModel, user: User) {
    try {
      this._accessTokenModel = jwtDecode<TokenModel>(authViewModel.accessToken);
      this._refreshTokenModel = jwtDecode<TokenModel>(authViewModel.refreshToken);
    } catch {
      this.closeBookmarks();
      this.notificationService.closeDialogs();
      this.router.navigate(['/login']);
    }
    this.calculateDeltaServerLocalTime();
    if (this._accessTokenModel) {
      this.recalculateEndpointConfiguration();
      // for (const key of Object.keys(this.endpointConfiguration)) {
      //   this.mapAccessToObject(this.endpointConfiguration[key], key);
      // }
    }

    this.authViewModel =
      ({...authViewModel, companies: authViewModel.companies ?? this.authViewModel.companies});
    this.setLocalStorageData(
      authViewModel.accessToken,
      authViewModel.refreshToken,
      authViewModel.sessionId,
      user);
  }

  public checkAuthorization(requestConfig: RequestConfig): Observable<HttpHeaders> {
    this.lastActivityTime = new Date();
    if ('isAuthorize' in requestConfig && requestConfig.isAuthorize) {
      if (!isNil(requestConfig.endpointConfiguration) && !requestConfig.endpointConfiguration.isAccessGranted) {
        const error: IErrorAuth = {errors: new Array<IError>()};

        let message = 'No permission';
        if (isDevMode()) {
          message = `${message} for ${String(requestConfig.endpointConfiguration.restMethod).toUpperCase()}
           endpoint ${requestConfig.endpointConfiguration.url}`;
        }

        error.errors.push({
          code: 17,
          message
        });
        return throwError(error);
      }
      if (this.isAuthenticated()) {
        this.refreshTokenIsNeed();
        if (this.isExpiredAccessToken()) {
          if (this.isExpiredRefreshToken()) {
            const error: IErrorAuth = {errors: new Array<IError>()};
            error.errors.push({code: 19, message: null});
            return throwError(error);
          } else {
            return this.refreshToken().pipe(
              map(() => {
                let headers: HttpHeaders = new HttpHeaders();
                headers = headers.append('Authorization', this.accessToken);
                return headers;
              }));
          }
        } else {
          let headers: HttpHeaders = new HttpHeaders();
          headers = headers.append('Authorization', this.accessToken);
          return of(headers);
        }
      } else {
        const error: IErrorAuth = {errors: new Array<IError>()};
        error.errors.push({code: 19, message: null});
        return throwError(error);
      }
    } else {
      return of(new HttpHeaders());
    }
  }

  private setLocalStorageData(
    accessToken: string,
    refreshToken: string,
    sessionId: string,
    user: User) {
    if (!isNil(accessToken)) {
      localStorage.setItem(this._authAccessToken, accessToken);
    } else {
      localStorage.removeItem(this._authAccessToken);
    }

    if (!isNil(refreshToken)) {
      localStorage.setItem(this._authRefreshToken, refreshToken);
    } else {
      localStorage.removeItem(this._authRefreshToken);
    }

    if (!isNil(sessionId)) {
      localStorage.setItem(this._authSessionId, sessionId);
    } else {
      localStorage.removeItem(this._authSessionId);
    }

    if (!isNil(user?.login)) {
      localStorage.setItem(this._authUserLogin, user.login);
    } else {
      localStorage.removeItem(this._authUserLogin);
    }

    if (!isNil(user?.firstName)) {
      localStorage.setItem(this._authUserFirstName, user.firstName);
    } else {
      localStorage.removeItem(this._authUserFirstName);
    }

    if (!isNil(user?.lastName)) {
      localStorage.setItem(this._authUserLastName, user.lastName);
    } else {
      localStorage.removeItem(this._authUserLastName);
    }

    // if (!isNil(user?.companyName)) {
    //   localStorage.setItem(this._authUserCompanyName, user.companyName);
    // } else {
    //   localStorage.removeItem(this._authUserCompanyName);
    // }
  }

  private cleanLocalStorageData() {
    localStorage.removeItem(this._authAccessToken);
    localStorage.removeItem(this._authRefreshToken);
    localStorage.removeItem(this._authSessionId);
    //localStorage.removeItem(this._authUserLogin);
    //localStorage.removeItem(this._authCompanyNumber);
    localStorage.removeItem(this._authUserFirstName);
    localStorage.removeItem(this._authUserLastName);
    localStorage.removeItem(this._authUserCompanyName);
  }

  private initializePermissions() {
    this.endpointConfiguration = {};
  }

  private calculateDeltaServerLocalTime() {
    this._deltaServerLocalTime = Math.floor((Date.now() - this._accessTokenModel.iat * 1000));
  }
}
