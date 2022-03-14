import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavMenuFullItem} from '../types/nav-menu-full-item';
import {BookmarkIcon} from '../../../types/bookmark/bookmark-icon';
import {AuthService} from '../../../services/auth/auth.service';
import {readRoles} from '../../../../shared/roles';

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
      iconSvg: 'icon-sub-link',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.TEACHER_DATA',
      roles: readRoles,
      items: [
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.COMMISSION',
          task: {
            route: 'commission/list',
            nameTranslateKey: 'COMMON.BOOKMARK.COMMISSION.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.COMMISSION.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.commissionList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.DEPARTMENT',
          task: {
            route: 'department/list',
            nameTranslateKey: 'COMMON.BOOKMARK.DEPARTMENT.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.DEPARTMENT.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.departmentList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.ACADEMIC_DEGREE',
          task: {
            route: 'academic-degree/list',
            nameTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.academicDegreeList,
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
