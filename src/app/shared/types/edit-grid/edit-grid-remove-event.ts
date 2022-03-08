import {GridComponent} from '@progress/kendo-angular-grid/dist/es2015/grid.component';
import {EditGridServerPagingComponent} from '../../components/edit-grid-server-paging/edit-grid-server-paging.component';

export interface EditGridRemoveEvent<T=any> {
  /**
   * The data item.
   */
  dataItem?: T;
  /**
   * The data row index for the operation.
   */
  rowIndex?: number;
  /**
   * The `GridComponent` instance.
   */
  sender?: GridComponent;
  /**
   * call back function to success operation
   */
  successCallback?: (success: boolean) => void;
  /**
   * The `Component` instance.
   */
  component?: EditGridServerPagingComponent;
}
