import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ViewNotificationComponent} from './views/view-notification/view-notification.component';
import {ErrorsModule} from '../../global/components/errors/errors.module';
import {NotificationRoutingModule} from './notification-routing.module';
import { TeachersToNotifyListComponent } from './components/teachers-to-notify-list/teachers-to-notify-list.component';

@NgModule({
  declarations: [
    ViewNotificationComponent,
    TeachersToNotifyListComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ErrorsModule,
    NotificationRoutingModule,
  ],
})
export class NotificationModule {
}
