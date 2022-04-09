import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {ViewExportComponent} from './views/view-export/view-export.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';
import {ViewPageNotFoundComponent} from '../../global/components/errors/view-page-not-found/view-page-not-found.component';

export const routingPaths = {
  exportPage: '',
};

const routes: Routes = [
  {
    path: routingPaths.exportPage,
    component: ViewExportComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true},
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
export class ExportRoutingModule {
}
