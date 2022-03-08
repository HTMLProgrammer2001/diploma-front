import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigLoadedGuard implements CanActivate {
  private isTranslateInitialized = false;

  constructor(protected translate: TranslateService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isTranslateInitialized) {
      return of(this.isTranslateInitialized);
    } else {
      return this.translate.get('COMMON.BUTTON.OK').pipe(
        map(() => true),
        tap((value) => this.isTranslateInitialized = value as boolean)
      );
    }
  }
}
