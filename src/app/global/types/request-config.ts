import {RestMethods} from './rest-methods';
import {IPermission} from './auth/services';

export interface RequestConfig {
  url?: string;
  isPreloader?: boolean;
  isAuthorize?: boolean;
  queryParams?: any;
  body?: any;
  restMethod?: RestMethods;
  endpointConfiguration?: IPermission;
  requestParams?: any;
}
