import {Component, OnInit} from '@angular/core';
import {BookmarkIcon} from '../../../types/bookmark/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../services/bookmark/bookmark.service';
import {BaseViewComponent} from '../../base-view/base-view.component';

@Component({
  selector: 'cr-view-page-forbidden',
  templateUrl: './view-page-forbidden.component.html',
  styleUrls: ['./view-page-forbidden.component.scss']
})
export class ViewPageForbiddenComponent extends BaseViewComponent implements OnInit {
  public url: string;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.FORBIDDEN.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.FORBIDDEN.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
      allowPinning: true,
    }, bookmarkService, router, route);

    this.url = this.route.snapshot.queryParamMap.get('url')?.split(/[?#]/)[0];
  }

  ngOnInit(): void {}
}
