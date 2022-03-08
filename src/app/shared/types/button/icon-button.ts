// all new added fields must be initialize null value
export class IconButton {
  width = '30px';
  height = '30px';
  icon = 'icon-add';
  classArray = new Array<string>();
  disabled: boolean = null;
  tooltipText: string = null;
  tooltipTranslateKey: string = null;
}
