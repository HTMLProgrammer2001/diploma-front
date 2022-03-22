import {Component, Input, OnInit} from '@angular/core';
import {NavMenuFullItem} from '../types/nav-menu-full-item';
import {Router} from '@angular/router';
import {NavMenuSmallItem} from '../types/nav-menu-small-item';
import {cloneDeep, isNil} from 'lodash';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'cr-nav-menu-small',
  templateUrl: './nav-menu-small.component.html',
  styleUrls: ['./nav-menu-small.component.scss']
})
export class NavMenuSmallComponent implements OnInit {
  @Input() menuItems: Array<NavMenuFullItem>;
  iconStyleLarge = {'width.px': '35', fill: 'rgb(150,50,255)'};

  constructor(private route: Router, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.menuItems = cloneDeep(this.menuItems);

    this.menuItems.forEach(item => {
      if (item.items) {
        const header: NavMenuSmallItem = {
          itemType: 'header',
          title: item.title,
          titleTranslateKeys: item.titleTranslateKeys,
        };

        item.items.unshift(header);
      } else {
        const header: NavMenuSmallItem = {
          ...item,
          itemType: 'link-header',
        };

        item.items = [header];
      }
    });
  }

  navigateByRoute(menuItem: NavMenuFullItem) {
    if (!isNil(menuItem) && !isNil(menuItem.task) && !isNil(menuItem.task.route)) {
      const emptyRoutePath = 'empty';
      this.route.navigateByUrl(emptyRoutePath, {skipLocationChange: true}).then(() =>
        this.route.navigate([menuItem.task.route]).then());
    }
  }
}
