import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './views/login.component';
import {ViewPageNotFoundComponent} from '../../global/components/errors/view-page-not-found/view-page-not-found.component';
import {BookmarkProcessGuard} from '../../global/services/bookmark/bookmark-process.guard';
import {AuthGuard} from '../../global/services/auth/auth.guard';

export const routingPaths = {
  login: ''
};

const routes: Routes = [
  {
    path: routingPaths.login,
    component: LoginComponent,
  },
  {
    path: '**',
    component: ViewPageNotFoundComponent,
    canActivate: [BookmarkProcessGuard, AuthGuard],
    canDeactivate: [BookmarkProcessGuard]
  }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
