import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './views/home/home.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {EmptyPageComponent} from './views/empty-page/empty-page.component';

@NgModule({
  declarations: [
    HomeComponent,
    EmptyPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
