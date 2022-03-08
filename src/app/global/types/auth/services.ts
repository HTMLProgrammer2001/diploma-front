import {RestMethods} from '../rest-methods';

export interface IServices {
}

// region Common
export interface IPermission {
  isAccessGranted: boolean;
  restrictByLicense: boolean;
  code: string;
  url: string;
  restMethod: RestMethods;
}

// endregion
