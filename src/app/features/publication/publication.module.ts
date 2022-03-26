import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewPublicationListComponent} from './views/view-publication-list/view-publication-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewPublicationDetailsComponent} from './views/view-publication-details/view-publication-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {PublicationRoutingModule} from './publication-routing.module';

@NgModule({
  declarations: [
    ViewPublicationListComponent,
    ViewPublicationDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    PublicationRoutingModule,
  ],
})
export class PublicationModule {
}
