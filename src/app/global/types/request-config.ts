import {RolesEnum} from './auth/roles.enum';

export interface RequestConfig {
  body: any;
  roles: Array<RolesEnum>;
  isPreloader?: boolean;
  isAuthorize?: boolean;
  additionalHeaders?: Map<string, string>;
}
