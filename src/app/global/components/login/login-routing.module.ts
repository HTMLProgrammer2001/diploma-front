import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './views/login.component';

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
    redirectTo: '/error/404'
  }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
