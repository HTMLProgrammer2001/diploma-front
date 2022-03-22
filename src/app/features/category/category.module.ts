import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewCategoryListComponent} from './views/view-category-list/view-category-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewCategoryDetailsComponent} from './views/view-category-details/view-category-details.component';
import { CategoryAttestationsListComponent } from './components/category-attestations-list/category-attestations-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {CategoryRoutingModule} from './category-routing.module';

@NgModule({
  declarations: [
    ViewCategoryListComponent,
    ViewCategoryDetailsComponent,
    CategoryAttestationsListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    CategoryRoutingModule,
  ],
})
export class CategoryModule {
}
