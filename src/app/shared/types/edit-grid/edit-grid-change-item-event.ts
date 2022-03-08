export interface EditGridChangeItemEvent<T = any> {
  /**
   * The data item.
   */
  dataItem?: T;

  /**
   * The data row index for the operation.
   */
  rowIndex?: number;

  /**
   * If this prop is true then this is add mode else edit
   **/
  isNew: boolean;
}
