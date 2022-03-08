import {IBookmarkData} from './bookmark-data';
import {isNil} from 'lodash';


export class PopupTab {
  tabs: Array<Tab> = new Array<Tab>();
  activeTabIndex: number;
  viewState: IBookmarkData;
  scrollBlock = false;

  constructor() {
    this.tabs.push({titleTranslateKey: 'COMMON.POP_UP.GENERAL', type: 'general'});
    this.activeTabIndex = 0;
  }

  static getPopupTabAndInitStates(popupStates: PopupTab): PopupTab {
    const initialPopupTab = new PopupTab();
    initialPopupTab.activeTabIndex = popupStates.activeTabIndex;
    initialPopupTab.tabs = popupStates.tabs;
    return initialPopupTab;
  }

  add(title: string, type: string): void {
    this.tabs.push({title, type});
    this.activeTabIndex++;
  }

  addTab(tab: Tab): void {
    this.tabs.push(tab);
    this.activeTabIndex++;
  }

  getTabByType(type: string): Tab {
    const tab = this.tabs.find(item => item.type === type);
    if (!isNil(tab)) {
      return tab;
    } else {
      return null;
    }
  }

  getActiveTab(): Tab {
    return this.tabs[this.activeTabIndex];
  }

  close(): void {
    if (this.activeTabIndex !== this.tabs.length - 1) {
      this.tabs.splice(this.tabs.length - 1, 1);
    } else {
      this.activeTabIndex--;
      this.tabs.splice(this.tabs.length - 1, 1);
    }
  }

  changedActive(index: number): void {
    this.activeTabIndex = index;
  }
}

export class Tab {
  title?: string;
  titleTranslateKey?: string;
  titleValue?: string;
  type: string;
  scrollPositionOffset?: number;
  contentElementHeight?: number;
}
