import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginLayoutComponent} from './layout/login-layout/login-layout.component';
import {ConfigLoadedGuard} from './global/services/config-loaded.guard';
import {AuthGuard} from './global/services/auth/auth.guard';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'error',
        redirectTo: 'error/404',
        pathMatch: 'full',
      },
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
    ]
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./global/components/login/login.module').then(m => m.LoginModule),
        canActivate: [ConfigLoadedGuard],
      },
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '**',
    redirectTo: 'error/404',
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
