import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTeachingRankListComponent} from './views/view-teaching-rank-list/view-teaching-rank-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewTeachingRankDetailsComponent} from './views/view-teaching-rank-details/view-teaching-rank-details.component';
import { TeachingRankTeachersListComponent } from './components/teaching-rank-teachers-list/teaching-rank-teachers-list.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {TeachingRankRoutingModule} from './teaching-rank-routing.module';

@NgModule({
  declarations: [
    ViewTeachingRankListComponent,
    ViewTeachingRankDetailsComponent,
    TeachingRankTeachersListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    TeachingRankRoutingModule,
  ],
})
export class TeachingRankModule {
}
