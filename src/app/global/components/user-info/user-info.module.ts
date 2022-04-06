import {NgModule} from '@angular/core';
import {UserInfoComponent} from './components/user-info.component';
import {CommonModule} from '@angular/common';
import {AvatarModule} from '@progress/kendo-angular-layout';
import {PopupModule} from '@progress/kendo-angular-popup';
import {SharedModule} from '../../../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    PopupModule,
    SharedModule,
  ],
  providers: [
  ],
  exports: [
    UserInfoComponent
  ]
})
export class UserInfoModule {

}