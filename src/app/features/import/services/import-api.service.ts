import {Injectable} from '@angular/core';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {IPaginator} from '../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {readRoles, writeRoles} from '../../../shared/roles';
import {
  generateImportTemplateQuery,
  getImportDropdownItemQuery,
  getImportTypeDropdownListQuery,
  importQuery
} from './import-queries';
import {IGenerateImportTemplateModel} from '../types/model/generate-import-template-model';
import {IImportBodyModel} from '../types/model/import-body-model';
import {IImportResultModel} from '../types/model/import-result-model';

@Injectable({providedIn: 'root'})
export class ImportApiService {
  constructor(private graphqlService: GraphqlCommonService) {
  }

  public getImportTypeDropdownList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getImportTypeDropdownListQuery,
      variables: {
        page: paginator.page,
        size: paginator.size,
        name: paginator.quickSearchFilter
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getImportTypeList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getImportTypeDropdownItem$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getImportDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getImportTypeById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }

  public generateImportTemplate$(type: number): Observable<IResponse<IGenerateImportTemplateModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: generateImportTemplateQuery,
      variables: {type},
      isPreloader: true,
      isAuthorize: true,
      roles: writeRoles,
      resultField: 'generateImportTemplate'
    };

    return this.graphqlService.requestToApi<IGenerateImportTemplateModel>(config);
  }

  public importData$(body: IImportBodyModel): Observable<IResponse<IImportResultModel>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: importQuery,
      variables: {body},
      isPreloader: true,
      isAuthorize: true,
      useMultipart: true,
      roles: writeRoles,
      resultField: 'importData'
    };

    return this.graphqlService.requestToApi<IImportResultModel>(config);
  }
}
