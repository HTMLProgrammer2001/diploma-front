import {IPaginatorBase} from './paginator-base';

export interface IPaginator<T> extends IPaginatorBase{
  responseList: Array<T>;
}
