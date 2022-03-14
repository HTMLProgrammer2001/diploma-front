import {RolesEnum} from './roles.enum';
import {AccessTokenTypeEnum} from './access-token-type.enum';

export class AccessTokenModel {
  type: AccessTokenTypeEnum;
  role: RolesEnum;
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
