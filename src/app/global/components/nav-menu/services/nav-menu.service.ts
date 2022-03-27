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
          roles: readRoles,
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
          roles: readRoles,
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
          roles: readRoles,
          task: {
            route: 'academic-degree/list',
            nameTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_DEGREE.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.academicDegreeList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.ACADEMIC_TITLE',
          roles: readRoles,
          task: {
            route: 'academic-title/list',
            nameTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_TITLE.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.ACADEMIC_TITLE.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.academicTitleList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.TEACHING_RANK',
          roles: readRoles,
          task: {
            route: 'teaching-rank/list',
            nameTranslateKey: 'COMMON.BOOKMARK.TEACHING_RANK.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.TEACHING_RANK.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.teachingRankList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.TEACHER',
          roles: readRoles,
          task: {
            route: 'teacher/list',
            nameTranslateKey: 'COMMON.BOOKMARK.TEACHER.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.TEACHER.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.teachingRankList,
          },
        },
      ],
    },
    {
      iconSvg: 'icon-sub-link',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.EDUCATION_DATA',
      roles: readRoles,
      items: [
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.EDUCATION_QUALIFICATION',
          roles: readRoles,
          task: {
            route: 'education-qualification/list',
            nameTranslateKey: 'COMMON.BOOKMARK.EDUCATION_QUALIFICATION.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.EDUCATION_QUALIFICATION.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.educationQualificationList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.EDUCATION',
          roles: readRoles,
          task: {
            route: 'education/list',
            nameTranslateKey: 'COMMON.BOOKMARK.EDUCATION.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.EDUCATION.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.educationList,
          },
        },
      ],
    },
    {
      iconSvg: 'icon-sub-link',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.ATTESTATION_DATA',
      roles: readRoles,
      items: [
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.CATEGORY',
          roles: readRoles,
          task: {
            route: 'category/list',
            nameTranslateKey: 'COMMON.BOOKMARK.CATEGORY.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.CATEGORY.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.categoryList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.INTERNSHIP',
          roles: readRoles,
          task: {
            route: 'internship/list',
            nameTranslateKey: 'COMMON.BOOKMARK.INTERNSHIP.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.INTERNSHIP.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.internshipList,
          },
        },
        {
          iconSvg: 'icon-sub-link',
          titleTranslateKeys: 'DASHBOARD.NAV_MENU.ATTESTATION',
          roles: readRoles,
          task: {
            route: 'attestation/list',
            nameTranslateKey: 'COMMON.BOOKMARK.ATTESTATION.LIST.BOOKMARK_NAME',
            descriptionTranslateKey: 'COMMON.BOOKMARK.ATTESTATION.LIST.BOOKMARK_DESCRIPTION',
            iconSvg: BookmarkIcon.attestationList,
          },
        },
      ]
    },
    {
      iconSvg: 'icon-sub-link',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.PUBLICATION',
      roles: readRoles,
      task: {
        route: 'publication/list',
        nameTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.LIST.BOOKMARK_NAME',
        descriptionTranslateKey: 'COMMON.BOOKMARK.PUBLICATION.LIST.BOOKMARK_DESCRIPTION',
        iconSvg: BookmarkIcon.publicationList,
      },
    },
    {
      iconSvg: 'icon-sub-link',
      titleTranslateKeys: 'DASHBOARD.NAV_MENU.HONOR',
      roles: readRoles,
      task: {
        route: 'honor/list',
        nameTranslateKey: 'COMMON.BOOKMARK.HONOR.LIST.BOOKMARK_NAME',
        descriptionTranslateKey: 'COMMON.BOOKMARK.HONOR.LIST.BOOKMARK_DESCRIPTION',
        iconSvg: BookmarkIcon.honorList,
      },
    },
  ];

  constructor(
    protected translate: TranslateService,
    protected authService: AuthService
  ) {
  }

  getAllLinks(): Array<NavMenuFullItem> {
    return this.links;
  }
}
