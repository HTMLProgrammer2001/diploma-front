import {IBookmarkViewState} from './bookmark-view-state';
import {IBookmarkData} from './bookmark-data';
import {PopupTab} from '../../../shared/components/popup-tabs/popup-tab';
import {ErrorViewModel} from '../../../shared/types/error-view-model';


export class Bookmark {
  id?: string;
  viewState: IBookmarkViewState;
  data: IBookmarkData;
  errorMessagesToDisableUpdate: Array<ErrorViewModel>;
  dataViewState: Map<string, any>;
  popupTab: PopupTab;

  constructor() {
    this.data = {};
    this.viewState = {};
    this.dataViewState = new Map<string, Bookmark>();
    this.popupTab = new PopupTab();
  }
}
