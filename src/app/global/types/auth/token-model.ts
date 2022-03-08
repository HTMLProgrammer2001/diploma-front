export class TokenModel {
  aud: string;
  sub: string;
  uid: number;
  iss: string;
  exp: number;
  iat: number;
  authorities: Array<string>;
  appt: number;
  cid: number;
}
