import {RouterModule, Routes} from '@angular/router';
import {BookmarkProcessGuard} from '../global/services/bookmark-process.guard';
import {NgModule} from '@angular/core';
import {ViewPageNotFoundComponent} from './view-page-not-found/view-page-not-found.component';
import {ViewPageForbiddenComponent} from './view-page-forbidden/view-page-forbidden.component';

export const routingPaths = {
  notFound: '404',
  forbidden: '403',
};

const routes: Routes = [
  {
    path: routingPaths.notFound,
    component: ViewPageNotFoundComponent,
    canActivate: [BookmarkProcessGuard],
    canDeactivate: [BookmarkProcessGuard]
  },
  {
    path: routingPaths.forbidden,
    component: ViewPageForbiddenComponent,
    canActivate: [BookmarkProcessGuard],
    canDeactivate: [BookmarkProcessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {
}
