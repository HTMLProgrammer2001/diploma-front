import {RolesEnum} from './auth/roles.enum';
import {RequestType} from './request-type';
import {TypedDocumentNode} from '@apollo/client/core';

export interface RequestConfig {
  query: TypedDocumentNode;
  variables?: any;
  roles?: Array<RolesEnum>;
  requestType: RequestType;
  isPreloader?: boolean;
  isAuthorize?: boolean;
  additionalHeaders?: Record<string, string>;
  resultField?: string;
  useMultipart?: boolean;
}
