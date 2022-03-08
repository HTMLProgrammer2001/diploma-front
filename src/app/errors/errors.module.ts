import {NgModule} from '@angular/core';
import {ViewPageNotFoundComponent} from './view-page-not-found/view-page-not-found.component';
import {ViewPageForbiddenComponent} from './view-page-forbidden/view-page-forbidden.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {ErrorsRoutingModule} from './errors-routing.module';


@NgModule({
  declarations: [
    ViewPageNotFoundComponent,
    ViewPageForbiddenComponent
  ],
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule {
}
