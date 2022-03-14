import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {AppRoutingModule} from '../app-routing.module';
import {BookmarkModule} from '../global/components/bookmark/bookmark.module';
import {SharedModule} from '../shared/shared.module';
import {LoginLayoutComponent} from './login-layout/login-layout.component';
import {NavMenuModule} from '../global/components/nav-menu/nav-menu.module';
import {UserInfoModule} from '../global/components/user-info/user-info.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    LoginLayoutComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BookmarkModule,
    SharedModule,
    NavMenuModule,
    UserInfoModule,
  ],
  exports: [
    MainLayoutComponent,
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
