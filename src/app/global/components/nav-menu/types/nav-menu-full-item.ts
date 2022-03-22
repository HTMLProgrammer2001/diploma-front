import {IBookmarkTask} from '../../../types/bookmark/bookmark-task';
import {RolesEnum} from '../../../types/auth/roles.enum';

export interface NavMenuFullItem {
  id?: string;
  iconSvg?: string;
  title?: string;
  titleTranslateKeys?: string;
  levelClass?: 'main-menu' | 'sub-main-menu' | 'sub-menu';
  itemType?: 'menu' | 'link' | 'header' | 'link-header' | 'section';
  expanded?: boolean;
  isFilterSuccess?: boolean;
  task?: IBookmarkTask;
  items?: Array<NavMenuFullItem>;
  roles?: Array<RolesEnum>;
}
