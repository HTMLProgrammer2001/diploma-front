import {isNil} from 'lodash';

import {IPaginator} from '../../types/paginator';
import {PaginatorSort} from '../../types/paginator-sort';
import {IPaginatorBase} from '../../types/paginator-base';

export class LocalPagingAdapter<T>{
  public dataSource: IPaginator<T> = null;
  public paginator: IPaginatorBase & {responseList?: Array<T>};

  constructor(public data: Array<T>, paginator?: IPaginatorBase & {responseList?: Array<T>}) {
    this.paginator = paginator || {};
    this.paginator.page = this.paginator.page || 1;
    this.paginator.size = this.paginator.size || 5;
    this.paginator.sort = this.paginator.sort || [];

    const startIndex = (this.paginator.page - 1) * this.paginator.size;

    this.dataSource = {
      page: this.paginator.page,
      size: this.paginator.size,
      skip: startIndex,
      responseList: this.paginator.responseList || this.data.slice(startIndex, startIndex + this.paginator.size),
      totalElements: isNil(this.paginator.totalElements) ? this.data.length : this.paginator.totalElements,
      totalPages: Math.ceil(this.data.length / this.paginator.size),
      sort: this.paginator.sort
    };

    this.paginator.responseList = this.dataSource.responseList;
    this.paginator.totalElements = this.dataSource.totalElements;
  }

  private updateDataSource(){
    const startIndex = (this.paginator.page - 1) * this.paginator.size;

    this.dataSource = {
      page: this.paginator.page,
      size: this.paginator.size,
      skip: startIndex,
      responseList: this.data.slice(startIndex, startIndex + this.paginator.size),
      totalElements: this.data.length,
      totalPages: Math.ceil(this.data.length / this.paginator.size),
      sort: this.paginator.sort
    };

    this.paginator.responseList = this.dataSource.responseList;
    this.paginator.totalElements = this.dataSource.totalElements;
  }

  setPage(newPage: number){
    this.paginator.page = newPage;
    this.updateDataSource();
  }

  setPageSize(newPageSize: number){
    this.paginator.size = newPageSize;
    this.updateDataSource();
  }

  setSort(newSort: PaginatorSort[]){
    this.paginator.sort = newSort;
    this.updateDataSource();
  }

  setData(newData: Array<T>){
    this.data = newData;
    this.updateDataSource();
  }

  copyFromPaginator(paginator: IPaginatorBase){
    this.paginator.page = paginator.page;
    this.paginator.size = paginator.size;
    this.paginator.sort = paginator.sort;

    this.updateDataSource();
  }
}
