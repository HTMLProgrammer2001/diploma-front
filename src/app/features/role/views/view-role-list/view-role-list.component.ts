import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {BaseViewComponent} from '../../../../global/components/base-view/base-view.component';
import {ErrorService} from '../../../../global/services/error.service';
import {CustomNotificationService} from '../../../../global/services/custom-notification.service';
import {BookmarkIcon} from '../../../../shared/constants/bookmark-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {BookmarkService} from '../../../../global/services/bookmark.service';
import {RoleFacadeService} from '../../services/role-facade.service';
import {PaginatorRequest} from '../../../../shared/types/paginator-request';
import {IPaginator} from '../../../../shared/types/paginator';
import {RoleListViewModel} from '../../types/view-model/role-list-view-model';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';
import {TitleHeaderElementManager} from '../../../../global/types/title-header/title-header-element-manager';
import {TitleHeaderElement} from '../../../../global/types/title-header/title-header-element';
import {AuthService} from '../../../../global/services/auth/auth.service';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {ItemListViewModel} from '../../types/view-model/item-list-view-model';

@Component({
  selector: 'cr-view-role-list',
  templateUrl: './view-role-list.component.html',
  styleUrls: ['./view-role-list.component.scss'],
})
export class ViewRoleListComponent extends BaseViewComponent implements OnInit, OnDestroy {
  public gridData: IPaginator<RoleListViewModel>;
  public paginatorRequest: PaginatorRequest;
  public titleHeaderButtonSettings: Array<TitleHeaderElement>;
  public titleHeaderButtonManager: TitleHeaderElementManager;
  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'code',
      titleTranslateKey: 'ADMIN_ROLE.LIST.GRID.ROLE_CODE',
      type: 'link',
      autoFit: true,
    },
    {
      field: 'name',
      titleTranslateKey: 'ADMIN_ROLE.LIST.GRID.ROLE_NAME',
      type: 'text',
      autoFit: true,
    }
  ];
  private subs: Subscription;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected bookmarkService: BookmarkService,
    private roleFacadeService: RoleFacadeService,
    private errorService: ErrorService,
    private customNotificationService: CustomNotificationService,
    public authService: AuthService,
  ) {
    super({
      nameTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.LIST.BOOKMARK_NAME',
      descriptionTranslateKey: 'COMMON.BOOKMARK.ADMIN_ROLE.LIST.BOOKMARK_DESCRIPTION',
      iconSvg: BookmarkIcon.adminRoleList,
      allowPinning: true,
    }, bookmarkService, router, route);
    this.initTitleHeaderButtons();
    this.refreshTitleHeaderButtons();
  }

  // region Component lifecycle
  ngOnInit(): void {
    this.getDataList();
  }

  ngOnDestroy(): void {
    if (!!this.subs) {
      this.subs.unsubscribe();
    }
  }

  // endregion

  // region Get and create data
  /**
   * Open bookmark for create new data
   */
  createNewData(): Promise<boolean> {
    const route = `/role/new`;
    return this.router.navigate([route]);
  }


  /**
   * Get data for grid
   */
  getDataList(): void {
    this.subs = forkJoin({
      paginator: this.roleFacadeService.getViewStateRoleListPaginator$(),
    }).subscribe(values => {
      this.paginatorRequest = values.paginator;
      this.roleFacadeService.getRoleList$(this.paginatorRequest).subscribe(value => {
          this.gridData = value;
          this.paginatorRequest.page = value.page.toString();
          this.paginatorRequest.size = value.size.toString();
        },
        error => {
          this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors));
        });
    }, error => {
      this.customNotificationService.showDialogError(this.errorService.getMessagesToShow(error.errors));
    });
  }

  // endregion

  //region Work with grid

  refresh(): void {
    this.bookmarkService.cleanCurrentCacheData();
    this.paginatorRequest.page = '1';
    this.getDataList();
  }
  /**
   * Click by row grid
   *
   * @param event - model of grid
   */
  cellClick(event: ItemListViewModel): Promise<boolean> {
    const route = `role/details/${event.id}`;
    return this.router.navigate([route]);
  }

  /**
   * Paging of grid
   *
   * @param paginator - model of paginator grid
   */

  changePage(paginator: IPaginatorBase): void {
    this.roleFacadeService.loadRoleList$({
      page: paginator.page.toString(),
      size: paginator.size.toString(),
    }).subscribe(value => {
      this.gridData = value;
      this.paginatorRequest.page = value.page.toString();
      this.paginatorRequest.size = value.size.toString();
    });
  }


  /**
   * Init title header buttons settings
   */
  initTitleHeaderButtons(): void {
    this.titleHeaderButtonManager = new TitleHeaderElementManager();
    this.titleHeaderButtonManager
      .addElement('refresh')
      .setVisibility(false)
      .addElement('add')
      .setVisibility(false)
      .addElement('close-bookmark');

    this.titleHeaderButtonSettings = this.titleHeaderButtonManager.getButtonList();
  }


  /**
   * Refresh title header buttons settings
   */
  refreshTitleHeaderButtons(): void {
    this.titleHeaderButtonManager.getById('add')
      .setVisibility(true)
      .getById('refresh')
      .setVisibility(true);
  }


  /**
   * Title button click
   */
  onTitleButtonClick(clickedButton: TitleHeaderElement) {
    switch (clickedButton.id) {
      case 'add':
        this.createNewData();
        break;
      case 'refresh':
        this.refresh();
        break;
    }
  }

  //endregion
}
