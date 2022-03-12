export interface IRefreshTokenModel {
  userId: number;
  sessionCode: string;
  iat: number;
  exp: number;
}
