import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {BookmarkService} from '../../../global/services/bookmark.service';
import {NavMenuFullItem} from '../types/nav-menu-full-item';
import {NavMenuService} from '../services/nav-menu.service';
import {ConfigService} from '../../../global/services/config.service';
import {uniqueId} from '../../../shared/utils';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'cr-nav-menu',
  templateUrl: './nav-menu-container.component.html',
  styleUrls: ['./nav-menu-container.component.scss']
})
export class NavMenuContainerComponent implements OnInit, OnChanges {
  @Input() collapsed: boolean;

  hideBigMenu = false;
  navigationLinks: Array<NavMenuFullItem> = [];
  navigationLinksData: Array<NavMenuFullItem> = [];
  filterText: string;

  constructor(
    private route: Router,
    private configService: ConfigService,
    private bookmarkService: BookmarkService,
    private navMenuService: NavMenuService,
    protected translate: TranslateService) {
    this.navigationLinks = navMenuService.getAllLinks();
  }

  ngOnInit(): void {
    this.initNavigationLinks(this.navigationLinks);

    this.navigationLinks.forEach(item => {
      item.levelClass = 'main-menu';
      if (!isNil(item.items) && !isEmpty(item.items)) {
        item.items.forEach(subItem => {
          subItem.levelClass = 'sub-main-menu';
        });
      }
    });

    this.navigationLinksData = cloneDeep(this.navigationLinks);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isNil(changes.collapsed) && changes.collapsed.currentValue) {
      this.navigationLinksData.forEach(item => item.expanded = false);
      setTimeout(() => this.hideBigMenu = true, 300);
    } else {
      this.hideBigMenu = false;
    }
  }

  public initNavigationLinks(navLinks: Array<NavMenuFullItem>): void {
    navLinks.forEach(value => {
      value.isFilterSuccess = true;
      value.levelClass = 'sub-menu';
      value.id = uniqueId();
      if (isNil(value.itemType)) {
        if (!isEmpty(value.items)) {
          value.itemType = 'menu';
        } else if (!isNil(value.task)) {
          value.itemType = 'link';
        }
      }
      if (!isEmpty(value.items)) {
        this.initNavigationLinks(value.items);
      }
    });
  }

  onFilter(filterText: string): void {
    if (!isNil(filterText)) {
      this.applyFilter(this.navigationLinksData, filterText);
    } else {
      this.clearFilter(this.navigationLinksData);
    }
  }

  clearFilter(navLinks: Array<NavMenuFullItem>): void {
    navLinks.forEach(item => {
      item.isFilterSuccess = true;
      if (!isEmpty(item.items)) {
        this.clearFilter(item.items);
      }
    });
  }

  applyFilter(navLinks: Array<NavMenuFullItem>, filterText: string): boolean {
    let isSuccess = false;
    navLinks.forEach(item => {
      let isChildrenSuccess = false;
      let isCurrentSuccess = false;
      if (!isEmpty(item.items)) {
        isChildrenSuccess = this.applyFilter(item.items, filterText);
      }

      if (item.itemType === 'section') {
        isCurrentSuccess = true;
      } else {
        if (!isNil(item.titleTranslateKeys)) {
          const titleTranslated = this.translate.instant(item.titleTranslateKeys);
          isCurrentSuccess = titleTranslated.toUpperCase().search(filterText.toUpperCase()) > -1;
        }
      }
      item.isFilterSuccess = isChildrenSuccess || isCurrentSuccess;
      isSuccess = isSuccess || isChildrenSuccess || isCurrentSuccess;
    });
    return isSuccess;
  }
}
