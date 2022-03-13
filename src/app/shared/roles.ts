import {RolesEnum} from '../global/types/auth/roles.enum';

export const readRoles = [RolesEnum.VIEWER, RolesEnum.MODERATOR, RolesEnum.ADMIN];
export const writeRoles = [RolesEnum.MODERATOR, RolesEnum.ADMIN];
export const userEditRoles = [RolesEnum.ADMIN];
export const configurationRoles = [RolesEnum.ADMIN];
export const notificationRoles = [RolesEnum.ADMIN, RolesEnum.MODERATOR];
