import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {AppRoutingModule} from '../app-routing.module';
import {NavMenuContainerComponent} from './nav-menu/nav-menu-container/nav-menu-container.component';
import {BookmarkModule} from '../global/components/bookmark/bookmark.module';
import {SharedModule} from '../shared/shared.module';
import {LoginLayoutComponent} from './login-layout/login-layout.component';
import {NavMenuFullComponent} from './nav-menu/nav-menu-full/nav-menu-full.component';
import {NavMenuSmallComponent} from './nav-menu/nav-menu-small/nav-menu-small.component';
import {MenuModule} from '@progress/kendo-angular-menu';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavMenuContainerComponent,
    LoginLayoutComponent,
    NavMenuFullComponent,
    NavMenuSmallComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BookmarkModule,
    SharedModule,
    MenuModule,
  ],
  exports: [
    MainLayoutComponent,
    NavMenuContainerComponent
  ],
  providers: []
})
export class LayoutModule {
  constructor(@Optional() @SkipSelf() parentModule: LayoutModule) {
    if (parentModule) {
      throw new Error('LayoutModule is already loaded. Import it in the AppModule only.');
    }
  }
}
