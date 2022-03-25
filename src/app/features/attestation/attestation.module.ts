import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewAttestationListComponent} from './views/view-attestation-list/view-attestation-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewAttestationDetailsComponent} from './views/view-attestation-details/view-attestation-details.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {AttestationRoutingModule} from './attestation-routing.module';

@NgModule({
  declarations: [
    ViewAttestationListComponent,
    ViewAttestationDetailsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    AttestationRoutingModule,
  ],
})
export class AttestationModule {
}
