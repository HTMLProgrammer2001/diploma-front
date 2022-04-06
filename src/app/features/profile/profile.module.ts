import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewProfileComponent} from './views/view-profile/view-profile.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {ProfileRoutingModule} from './profile-routing.module';

@NgModule({
  declarations: [
    ViewProfileComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    ProfileRoutingModule,
  ],
})
export class ProfileModule {
}
