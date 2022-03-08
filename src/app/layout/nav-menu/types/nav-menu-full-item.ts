import {IBookmarkTask} from '../../../global/types/bookmark-task';

export interface NavMenuFullItem {
  id?: string;
  iconSvg?: string;
  title?: string;
  titleTranslateKeys?: string;
  levelClass?: 'main-menu' | 'sub-main-menu' | 'sub-menu';
  itemType?: 'menu' | 'link' | 'header' | 'section';
  expanded?: boolean;
  isFilterSuccess?: boolean;
  task?: IBookmarkTask;
  items?: Array<NavMenuFullItem>;
  isAccessGranted?: () => boolean;
}
