import {TitleHeaderElementAppearance} from './title-header-element-appearance';
import {TitleHeaderElementTemplate} from './title-header-element-template';

export interface TitleHeaderElement {
  id?: string;
  template: TitleHeaderElementTemplate;
  name?: string;
  nameTranslateKey?: string;
  tooltipText?: string;
  tooltipTranslateKey?: string;
  iconSvg?: string;
  appearance?: TitleHeaderElementAppearance;
  isDisabled?: boolean;
  isVisible?: boolean;
}
