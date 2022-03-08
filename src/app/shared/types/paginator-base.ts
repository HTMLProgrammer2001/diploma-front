import {PaginatorSort} from './paginator-sort';

export interface IPaginatorBase {
  elementsCount?: number;
  page?: number;
  skip?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  quickSearchFilter?: string;
  sort?: PaginatorSort[];
}
