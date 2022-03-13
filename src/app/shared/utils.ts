import moment from 'moment';
import {isEmpty, isNil} from 'lodash';
import {IResponse} from './types/response';
import {IError} from './types/error';
import {Validator} from './types/validation/validator';
import {DateTimeType} from './types/date-time-type';

export const addRemoveClass = (element: HTMLElement, className: string, isAdd: boolean): void =>
  isAdd ? element.classList.add(className) : element.classList.remove(className);

export const isLanguageRtl = (lang: string) => {
  const rtlCodes = ['ar', 'arc', 'ckb', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ps', 'sd', 'ur', 'yi'];
  return rtlCodes.some(code => lang?.toLowerCase().startsWith(code));
};

export const transformDate = (value: any): any => {
  const formats = [moment.ISO_8601, 'YYYY-MM-DD HH:mm:ss'];
  if (!!value && isNaN(Number(value)) && moment(value.toString(), formats, true).isValid()) {
    return moment(value).format('YYYY-MM-DD');
  }
  return value;
};

export const transformDateToStringLocalTimeZone = (value: Date): string => moment(value).format('YYYY-MM-DDTHH:mm:ssZ');

export const transformDateToStringZeroTimeNonTimeZone = (value: Date): string => moment(value).format('YYYY-MM-DDTHH:mm:ss');

export const transformDateToStringByType = (date: Date, value: DateTimeType): string => {
  switch (value) {
    case 'local-time-zone':
      return transformDateToStringLocalTimeZone(date);
    default:
      return transformDateToStringZeroTimeNonTimeZone(date);
  }
};

export const uniqueId = (): string => `f${((Math.random() * 1e8)).toString(16)}`;

export const convertToIResponse = <T>(data: T, errors: Array<IError> = []): IResponse<T> => ({
  errors,
  data: data as T
});

export const isEmptyObject = (value: any): boolean => value === undefined || value === null || value === '';

export const copyToClipboard = (val: string) => {
  const selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
};

export const clearSerializeObject = <T>(obj: T): T => {
  Object.keys(obj).forEach(prop => {
    if (prop.toLowerCase().includes('validator') && !isNil(obj[prop])) {
      const validator: Validator = obj[prop];
      validator.validationGroups.forEach(value => value.validationRules = null);
      validator.dto = null;
    }
  });

  return obj as T;
};

export const interpolateString = (textTemplate: string, value: any): string => {
  if (!isNil(value)) {
    for (const key in value) {
      if (!isNil(value[key]) && typeof (value[key]) !== 'object') {
        textTemplate = textTemplate.replace('{{' + key + '}}', value[key]);
      }
    }
  }

  return textTemplate;
};

export const interpolateUrl = (textTemplate: string, value: any) => {
  if (!isEmpty(value) && !isNil(value)) {
    for (const key in value) {
      if (!isNil(value[key])) {
        textTemplate = textTemplate.replace('{' + key + '}', value[key]);
      }
    }
  }
  return textTemplate;
};

export const parseTimezone = (dateStr: string): string => {
  const localDateStr = dateStr.substr(0, 10).trim();
  const localTimeStr = dateStr.substring(10)
    .replace(/Z|[+-]\d\d(?::?\d\d)?/gi, '')
    .replace(/[a-zA-Z]/, '')
    .trim();

  return localDateStr + (localTimeStr.length ? ' ' : '') + localTimeStr;
};

export const isTruncated = (element: HTMLElement): boolean => {
  const computed = getComputedStyle(element.parentElement);
  const parentWidth = element.parentElement.clientWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight);
  return parentWidth < element.offsetWidth;
};
