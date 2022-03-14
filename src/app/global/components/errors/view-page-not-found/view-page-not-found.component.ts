import {Component, OnInit} from '@angular/core';
import {BaseViewComponent} from '../../base-view/base-view.component';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../services/bookmark/bookmark.service';
import {BookmarkIcon} from '../../../types/bookmark/bookmark-icon';

@Component({
  selector: 'cr-view-page-not-found',
  templateUrl: './view-page-not-found.component.html',
  styleUrls: ['./view-page-not-found.component.scss']
})
export class ViewPageNotFoundComponent extends BaseViewComponent implements OnInit {
  public url: string;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.NOT_FOUND.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.NOT_FOUND.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
      allowPinning: true,
    }, bookmarkService, router, route);

    this.url = this.router.url.split(/[?#]/)[0];
  }

  ngOnInit(): void {
  }

}
