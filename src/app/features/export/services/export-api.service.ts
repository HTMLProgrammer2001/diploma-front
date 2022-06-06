import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IResponse} from '../../../shared/types/response';
import {GraphqlCommonService} from '../../../global/services/graphql-common.service';
import {RequestConfig} from '../../../global/types/request-config';
import {RequestType} from '../../../global/types/request-type';
import {IPaginatorBase} from '../../../shared/types/paginator-base';
import {IPaginator} from '../../../shared/types/paginator';
import {IdNameSimpleItem} from '../../../shared/types/id-name-simple-item';
import {
  generateReportQuery,
  getExportCommissionDropdownItemQuery,
  getExportCommissionDropdownListQuery,
  getExportDepartmentDropdownItemQuery,
  getExportDepartmentDropdownListQuery,
  getExportTypesQuery,
  getExportTeacherDropdownItemsQuery,
  getExportTeacherDropdownListQuery
} from './export-queries';
import {IGenerateReportFilterModel} from '../types/model/generate-report-filter-model';
import {IGenerateReportGetModel} from '../types/model/generate-report-get-model';
import {readRoles} from '../../../shared/roles';

@Injectable({providedIn: 'root'})
export class ExportApiService {
  constructor(private graphqlService: GraphqlCommonService) {}

  public getExportCommissionList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportCommissionDropdownListQuery,
      variables: {
        page: paginator.page,
        size: paginator.size,
        name: paginator.quickSearchFilter
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCommissionsList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getExportCommissionById$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportCommissionDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getCommissionById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }

  public getExportDepartmentList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportDepartmentDropdownListQuery,
      variables: {
        page: paginator.page,
        size: paginator.size,
        name: paginator.quickSearchFilter
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getDepartmentsList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getExportDepartmentById$(id: number): Observable<IResponse<IdNameSimpleItem>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportDepartmentDropdownItemQuery,
      variables: {id},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getDepartmentById'
    };

    return this.graphqlService.requestToApi<IdNameSimpleItem>(config);
  }

  public getExportTeacherList$(paginator: IPaginatorBase): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportTeacherDropdownListQuery,
      variables: {
        page: paginator.page,
        size: paginator.size,
        name: paginator.quickSearchFilter
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeacherList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public getExportTeacherByIds$(ids: Array<number>): Observable<IResponse<Array<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportTeacherDropdownItemsQuery,
      variables: {ids},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getTeachersByIds'
    };

    return this.graphqlService.requestToApi<Array<IdNameSimpleItem>>(config);
  }

  public getExportTypes$(): Observable<IResponse<IPaginator<IdNameSimpleItem>>> {
    const config: RequestConfig = {
      requestType: RequestType.QUERY,
      query: getExportTypesQuery,
      variables: {
        query: {
          page: 1,
          size: 100
        }
      },
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'getExportTypeList'
    };

    return this.graphqlService.requestToApi<IPaginator<IdNameSimpleItem>>(config);
  }

  public generateReport$(filter: IGenerateReportFilterModel): Observable<IResponse<IGenerateReportGetModel>> {
    const config: RequestConfig = {
      requestType: RequestType.MUTATION,
      query: generateReportQuery,
      variables: {body: filter},
      isPreloader: true,
      isAuthorize: true,
      roles: readRoles,
      resultField: 'generateReport'
    };

    return this.graphqlService.requestToApi<IGenerateReportGetModel>(config);
  }
}
