import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {ViewNotificationComponent} from './views/view-notification/view-notification.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';
import {ViewPageNotFoundComponent} from '../../global/components/errors/view-page-not-found/view-page-not-found.component';
import {configurationRoles} from '../../shared/roles';

export const routingPaths = {
  exportPage: '',
};

const routes: Routes = [
  {
    path: routingPaths.exportPage,
    component: ViewNotificationComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true, roles: configurationRoles},
  },
  {
    path: '**',
    component: ViewPageNotFoundComponent,
    canActivate: [BookmarkProcessGuard, AuthGuard],
    canDeactivate: [BookmarkProcessGuard],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {
}
