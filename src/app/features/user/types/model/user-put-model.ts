export interface IUserPutModel {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  avatar: File;
  roleId: number;
  guid: string;
}
