import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewImportComponent} from './views/view-import/view-import.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {ImportRoutingModule} from './import-routing.module';
import { ImportErrorsComponent } from './components/import-errors/import-errors.component';

@NgModule({
  declarations: [
    ViewImportComponent,
    ImportErrorsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    ImportRoutingModule,
  ],
})
export class ImportModule {
}
