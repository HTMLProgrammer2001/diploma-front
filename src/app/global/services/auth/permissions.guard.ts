import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {BookmarkService} from '../bookmark/bookmark.service';
import {BookmarkProcessGuard} from '../bookmark/bookmark-process.guard';

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

    const isPermit = !route.data.roles || route.data.roles.includes(this.authService.currentRole);

    if (isPermit) {
      return this.bookmarkProcessGuard.canActivate(route, state);
    } else {
      const url = route.pathFromRoot.filter(el => el.url?.length)
        .reduce((acc, routePart) => acc + '/' + routePart.url, '');
      return this.router.navigate(['403'], {queryParams: {url}});
    }
  }
}
