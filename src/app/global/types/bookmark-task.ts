export interface IBookmarkTask {
  id?: string;
  isDataChanged?: boolean;
  checkDataChanged?: () => boolean;
  isPinned?: boolean;
  allowPinning?: boolean;

  name?: string;
  nameTranslateKey?: string;
  nameValue?: string;
  description?: string;
  descriptionTranslateKey?: string;
  iconSvg?: string;
  route?: string;
  params?: Record<string, string>;
}
