import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginLayoutComponent} from './layout/login-layout/login-layout.component';
import {ConfigLoadedGuard} from './global/services/config/config-loaded.guard';
import {AuthGuard} from './global/services/auth/auth.guard';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {ViewPageNotFoundComponent} from './global/components/errors/view-page-not-found/view-page-not-found.component';
import {BookmarkProcessGuard} from './global/services/bookmark/bookmark-process.guard';
import {ViewPageForbiddenComponent} from './global/components/errors/view-page-forbidden/view-page-forbidden.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),
        canActivate: [ConfigLoadedGuard, AuthGuard],
        data: {redirectToDashboardIfAuthorized: true},
      },
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    component: MainLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        canActivate: [ConfigLoadedGuard, AuthGuard],
      },
      {
        path: 'commission',
        loadChildren: () => import('./features/commission/commission.module').then(m => m.CommissionModule),
        canActivate: [ConfigLoadedGuard, AuthGuard],
      },
      {
        path: 'department',
        loadChildren: () => import('./features/department/department.module').then(m => m.DepartmentModule),
        canActivate: [ConfigLoadedGuard, AuthGuard],
      },
      {
        path: '403',
        component: ViewPageForbiddenComponent,
        canActivate: [BookmarkProcessGuard, AuthGuard],
        canDeactivate: [BookmarkProcessGuard]
      },
      {
        path: '**',
        component: ViewPageNotFoundComponent,
        canActivate: [BookmarkProcessGuard, AuthGuard],
        canDeactivate: [BookmarkProcessGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule],
})

export class AppRoutingModule {

}
