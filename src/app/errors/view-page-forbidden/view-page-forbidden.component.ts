import {Component, OnInit} from '@angular/core';
import {BookmarkIcon} from '../../shared/constants/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../global/services/bookmark.service';
import {BaseViewComponent} from '../../global/components/base-view/base-view.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'cr-view-page-forbidden',
  templateUrl: './view-page-forbidden.component.html',
  styleUrls: ['./view-page-forbidden.component.scss']
})
export class ViewPageForbiddenComponent extends BaseViewComponent implements OnInit {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private translate: TranslateService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.FORBIDDEN.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ERROR_PAGE.FORBIDDEN.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.dashboard,
      allowPinning: true,
    }, bookmarkService, router, route);
  }

  ngOnInit(): void {
  }

}
