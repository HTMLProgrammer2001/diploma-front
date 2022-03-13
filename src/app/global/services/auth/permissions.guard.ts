import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {BookmarkService} from '../bookmark.service';
import {BookmarkProcessGuard} from '../bookmark-process.guard';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private bookmarkService: BookmarkService,
    private router: Router,
    private bookmarkProcessGuard: BookmarkProcessGuard) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isPermited = !route.data.roles || route.data.roles.includes(this.authService.currentRole);

    if (isPermited) {
      return this.bookmarkProcessGuard.canActivate(route, state);
    } else {
      return this.router.parseUrl('error/403');
    }
  }
}
