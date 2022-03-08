import {Component, OnInit} from '@angular/core';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark.service';
import {BookmarkIcon} from '../../../../shared/constants/bookmark-icon';

@Component({
  selector: 'cr-home',
  templateUrl: './home.component.html'
})
export class HomeComponent extends BaseViewComponent implements OnInit {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ADMIN_HOME.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ADMIN_HOME.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
      allowPinning: true,
    }, bookmarkService, router, route);
  }

  ngOnInit(): void {
  }

}
