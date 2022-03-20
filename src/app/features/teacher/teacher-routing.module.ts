import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewTeacherListComponent} from './views/view-teacher-list/view-teacher-list.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {ViewTeacherDetailsComponent} from './views/view-teacher-details/view-teacher-details.component';
import {AuthGuard} from '../../global/services/auth/auth.guard';
import {PermissionsGuard} from '../../global/services/auth/permissions.guard';
import {readRoles, writeRoles} from '../../shared/roles';
import {ViewPageNotFoundComponent} from '../../global/components/errors/view-page-not-found/view-page-not-found.component';
import {matchId} from '../../shared/utils';


export const routingPaths = {
  list: 'list',
  details: 'details/:id',
  new: 'new',
};

const routes: Routes = [
  {
    path: routingPaths.list,
    component: ViewTeacherListComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {allowPinning: true, roles: readRoles},
  },
  {
    matcher: matchId(routingPaths.details),
    component: ViewTeacherDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: readRoles}
  },
  {
    path: routingPaths.new,
    component: ViewTeacherDetailsComponent,
    canActivate: [AuthGuard, PermissionsGuard],
    canDeactivate: [BookmarkProcessGuard],
    data: {roles: writeRoles}
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
export class TeacherRoutingModule {
}