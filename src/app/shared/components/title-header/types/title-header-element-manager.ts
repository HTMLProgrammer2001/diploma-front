import {TitleHeaderElement} from './title-header-element';
import {isEmpty, isNil} from 'lodash';
import {TitleHeaderElementTemplate} from './title-header-element-template';
import {TitleHeaderElementAppearance} from './title-header-element-appearance';

export class TitleHeaderElementManager {

  private elementList: Array<TitleHeaderElement>;
  private currentElement: TitleHeaderElement;

  constructor(elementList: Array<TitleHeaderElement> = null) {
    if (isNil(elementList)) {
      this.elementList = new Array<TitleHeaderElement>();
    } else {
      this.initElementList(elementList);
    }
  }

  initElementList(elementList: Array<TitleHeaderElement>) {
    if (!isEmpty(elementList)) {
      elementList.forEach(item => {
        this.initElement(item);
      });
    }
    this.elementList = elementList;
  }

  initElement(item: TitleHeaderElement): TitleHeaderElement {
    if (item.template !== 'custom') {
      switch (item.template) {
        case 'pin' :
          item.id = item.template;
          item.appearance = 'icon-button';
          break;
        case 'add':
          item.id = item.template;
          item.iconSvg = 'icon-add';
          item.appearance = 'icon-button';
          break;
        case 'delete':
          item.id = item.template;
          item.iconSvg = 'icon-delete';
          item.appearance = 'icon-button';
          break;
        case 'update':
          item.id = item.template;
          item.nameTranslateKey = 'COMMON.BUTTON.SAVE';
          item.appearance = 'primary-button';
          break;
        case 'create':
          item.id = item.template;
          item.nameTranslateKey = 'COMMON.BUTTON.CREATE';
          item.appearance = 'primary-button';
          break;
        case 'cancel':
          item.id = item.template;
          item.nameTranslateKey = 'COMMON.BUTTON.CANCEL';
          item.appearance = 'primary-button';
          break;
        case 'refresh':
          item.id = item.template;
          item.iconSvg = 'icon-refresh';
          item.appearance = 'icon-button';
          break;
        case 'close':
          item.id = item.template;
          item.iconSvg = 'icon-close';
          item.appearance = 'icon-button';
          break;
        case 'close-bookmark':
          item.id = item.template;
          item.iconSvg = 'icon-close';
          item.appearance = 'icon-button';
          break;
        case 'delete-status':
          item.id = item.template;
          item.nameTranslateKey = 'COMMON.STATUS.DELETED';
          item.iconSvg = 'icon-warning';
          item.appearance = 'status';
          break;
        case 'status':
          item.appearance = 'status';
          break;
        case 'separator':
          item.appearance = 'separator';
          break;
        case 'restore':
          item.id = item.template;
          item.appearance = 'primary-button';
          item.nameTranslateKey = 'COMMON.BUTTON.RESTORE';
          break;
        case 'confirm-restore':
          item.id = item.template;
          item.appearance = 'primary-button';
          item.nameTranslateKey = 'COMMON.BUTTON.CONFIRM_RESTORE';
          break;
        case 'cancel-restore':
          item.id = item.template;
          item.appearance = 'primary-button';
          item.nameTranslateKey = 'COMMON.BUTTON.CANCEL_RESTORE';
          break;
      }
    }
    return item;
  }

  addElement(template: TitleHeaderElementTemplate): TitleHeaderElementManager {
    const btn = this.initElement({template});
    this.elementList.push(btn);
    this.currentElement = btn;
    return this;
  }


  getById(id: string): TitleHeaderElementManager {
    this.currentElement = null;
    if (!isEmpty(this.elementList)) {
      this.currentElement = this.elementList.find(item => item.id === id);
    }
    return this;
  }

  // set(button: TitleHeaderButton): TitleHeaderButtonManager {
  //   for (const prop in button) {
  //     if (button[prop] !== undefined){
  //       this.currentButton[prop] = button[prop];
  //     }
  //   }
  //   return this;
  // }

  setId(id: string): TitleHeaderElementManager {
    this.currentElement.id = id;
    return this;
  }

  setTemplate(template: TitleHeaderElementTemplate): TitleHeaderElementManager {
    this.currentElement.template = template;
    return this;
  }

  setName(name: string): TitleHeaderElementManager {
    this.currentElement.name = name;
    return this;
  }

  setNameTranslateKey(nameTranslateKey: string): TitleHeaderElementManager {
    this.currentElement.nameTranslateKey = nameTranslateKey;
    return this;
  }

  setTooltipText(tooltipText: string): TitleHeaderElementManager {
    this.currentElement.tooltipText = tooltipText;
    return this;
  }

  setTooltipTranslateKey(tooltipTranslateKey: string): TitleHeaderElementManager {
    this.currentElement.tooltipTranslateKey = tooltipTranslateKey;
    return this;
  }

  setIconSvg(iconSvg: string): TitleHeaderElementManager {
    this.currentElement.iconSvg = iconSvg;
    return this;
  }

  setAppearance(appearance: TitleHeaderElementAppearance): TitleHeaderElementManager {
    this.currentElement.appearance = appearance;
    return this;
  }

  setVisibility(isVisible: boolean): TitleHeaderElementManager {
    this.currentElement.isVisible = isVisible;
    return this;
  }

  setDisable(isDisabled: boolean): TitleHeaderElementManager {
    this.currentElement.isDisabled = isDisabled;
    return this;
  }

  getButtonList(): Array<TitleHeaderElement> {
    return this.elementList;
  }
}
