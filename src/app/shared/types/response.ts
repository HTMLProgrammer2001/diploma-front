import {IError} from './error';

export interface IResponse<T> {
  data: T;
  errors: Array<IError>;
  status?: any;
}
