import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewInternshipListComponent} from './views/view-internship-list/view-internship-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewInternshipDetailsComponent} from './views/view-internship-details/view-internship-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {InternshipRoutingModule} from './internship-routing.module';

@NgModule({
  declarations: [
    ViewInternshipListComponent,
    ViewInternshipDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    InternshipRoutingModule,
  ],
})
export class InternshipModule {
}
