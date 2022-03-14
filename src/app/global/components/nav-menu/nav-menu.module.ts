import {NgModule} from '@angular/core';
import {MenuModule} from '@progress/kendo-angular-menu';
import {NavMenuContainerComponent} from './nav-menu-container/nav-menu-container.component';
import {NavMenuFullComponent} from './nav-menu-full/nav-menu-full.component';
import {NavMenuSmallComponent} from './nav-menu-small/nav-menu-small.component';
import {SharedModule} from '../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {PanelBarModule} from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [
    NavMenuContainerComponent,
    NavMenuFullComponent,
    NavMenuSmallComponent,
  ],
  imports: [
    CommonModule,
    PanelBarModule,
    MenuModule,
    SharedModule,
  ],
  exports: [
    NavMenuContainerComponent,
  ]
})
export class NavMenuModule {}
