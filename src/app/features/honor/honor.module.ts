import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewHonorListComponent} from './views/view-honor-list/view-honor-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewHonorDetailsComponent} from './views/view-honor-details/view-honor-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {HonorRoutingModule} from './honor-routing.module';

@NgModule({
  declarations: [
    ViewHonorListComponent,
    ViewHonorDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    HonorRoutingModule,
  ],
})
export class HonorModule {
}
