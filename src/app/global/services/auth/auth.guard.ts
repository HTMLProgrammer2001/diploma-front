import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && !this.authService.isExpiredAccessToken()) {
      if (!!route.data.redirectToDashboardIfAuthorized) {
        return this.router.parseUrl('/');
      } else {
        return true;
      }
    } else {
      if (!route.data.redirectToDashboardIfAuthorized) {
        return this.router.parseUrl('/login');
      } else {
        return true;
      }
    }
  }
}
