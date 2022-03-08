import {Injectable} from '@angular/core';
import {Config} from '../../types/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config.service';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {User} from '../../types/auth/user';
import {AuthModel} from '../../types/auth/auth-model';
import {AuthMapperService} from './auth-mapper.service';
import {map} from 'rxjs/operators';
import {AuthViewModel} from '../../types/auth/auth-view-model';
import {RefreshTokenModel} from '../../types/auth/refresh-token-model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  config: Config = null;
  AUTH_CONFIG = null;

  constructor(
    private authMapperService: AuthMapperService,
    private http: HttpClient,
    private configService: ConfigService) {
  }

  public login$(user: User): Observable<IResponse<AuthViewModel>> {
    const headers = new HttpHeaders({preloader: 'on'});

    const request = `${this.AUTH_CONFIG.requests.login.url}`;
    return this.http.post<IResponse<AuthModel>>(request, this.authMapperService.userToUserAuthModel(user), {headers}).pipe(
      map(value => ({...value, data: this.authMapperService.authToViewModel(value.data)}))
    );
  }
  public logout$(sessionId: string): Observable<IResponse<void>> {
    const headers = new HttpHeaders({preloader: 'on'});
    const request = `${this.AUTH_CONFIG.requests.logout.url}`;
    return this.http.post<IResponse<void>>(request, {sessionId}, {headers});
  }

  public refreshToken$(refreshTokenModel: RefreshTokenModel): Observable<IResponse<AuthViewModel>> {
    const headers = new HttpHeaders({preloader: 'on'});
    const request = `${this.AUTH_CONFIG.requests.refresh.url}`;
    return this.http.post<IResponse<AuthModel>>(request, refreshTokenModel, {headers}).pipe(
      map(value => ({...value, data: this.authMapperService.authToViewModel(value.data)}))
    );
  }
}