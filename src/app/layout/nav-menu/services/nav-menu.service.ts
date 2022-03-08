import {Injectable} from '@angular/core';
import {NavMenuFullItem} from '../types/nav-menu-full-item';
import {TranslateService} from '@ngx-translate/core';
import {BookmarkIcon} from '../../../shared/constants/bookmark-icon';
import {AuthService} from '../../../global/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NavMenuService {
  links: Array<NavMenuFullItem> = [
    {
      iconSvg: 'icon-dashboard',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.DASHBOARD',
      task: {
        route: '',
        nameTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_NAME',
        descriptionTranslateKey: 'COMMON.BOOKMARK.DASHBOARD.BOOKMARK_DESCRIPTION',
        iconSvg: BookmarkIcon.dashboard,
      },
    },
    {
      iconSvg: 'icon-partners',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.ROLE',
      items: [
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.ROLE_LIST',
          isAccessGranted: () => true,
          task: {
            route: 'role/list',
            nameTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.adminRoleList,
          },
        },
      ],
    },
  ];

  constructor(
    protected translate: TranslateService,
    protected authService: AuthService
  ) { }


  getAllLinks(): Array<NavMenuFullItem> {
    return this.links;
  }
}
