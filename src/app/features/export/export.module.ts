import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewExportComponent} from './views/view-export/view-export.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {ExportRoutingModule} from './export-routing.module';

@NgModule({
  declarations: [
    ViewExportComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    ExportRoutingModule,
  ],
})
export class ExportModule {
}
