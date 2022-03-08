import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookmarkListComponent} from './bookmark-list/bookmark-list.component';
import {IconModule} from '@progress/kendo-angular-icons';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [BookmarkListComponent],
  imports: [
    CommonModule,
    IconModule,
    SharedModule
  ],
  exports: [BookmarkListComponent]
})
export class BookmarkModule {
}
