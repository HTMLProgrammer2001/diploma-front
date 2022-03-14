import {Component, OnInit} from '@angular/core';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark/bookmark.service';
import {BookmarkIcon} from '../../../../global/types/bookmark/bookmark-icon';

@Component({
  selector: 'cr-home',
  templateUrl: './home.component.html'
})
export class HomeComponent extends BaseViewComponent {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
      allowPinning: true,
    }, bookmarkService, router, route);
  }
}
