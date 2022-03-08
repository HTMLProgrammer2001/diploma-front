import {Observable} from 'rxjs';
import {IPaginator} from '../paginator';
import {ButtonTemplateType} from '../button/button-template-type';

export interface IEditGridColumnSetting {
  /**
   * Field name for display
   */
  field?: string;

  /**
   * Text title for field in edit mode
   */
  title?: string;

  /**
   * Text title translate key for field in edit mode
   */
  titleTranslateKey?: string;

  /**
   * If this field is false then field can be edited in edit mode else it's only for reading.
   */
  isReadOnly?: boolean;

  /**
   * If this field is true then link field not emit cellClick event.
   */
  isLinkDisabled?: boolean;

  /**
   * If this field is true then this field will autofit this column. <br>
   * **IMPORTANT** Can not be used with *width* property. <br>
   * **IMPORTANT** MUST be used with grid *resizable* input set to true.
   */
  autoFit?: boolean;

  /**
   * If this value is true then this field is sortable. MUST be used with grid *sortable* boolean set to true.
   */
  sortable?: boolean;

  /**
   * This is format field. It can be used with numeric, date and date-time column
   */
  format?: string;
  type?: EditGridColumnType;

  /**
   * This value defines how many digits are being used after point. Can be used only with numeric.
   */
  decimals?: number;

  /**
   * Fixed width of column. <br>
   * **IMPORTANT**: this option will not work with *autofit* option.
   */
  width?: string;

  /**
   * If this field is true then hide column.
   */
  hidden?: boolean;

  /**
   * If this field is true then \n symbol in header will break line.
   */
  headerWrap?: boolean;

  /**
   * Code field name
   */
  codeField?: string;

  /**
   * This field can be used with boolean, date or dropdown field for enable ability to change value in read mode
   */
  allowInCellEditing?: boolean;

  /**
   * This is field name which used for hide or show data in cell.
   * Grid checks field and hide or show content in cell according of data in dataItem[visibilityField]
   */
  visibilityField?: string;

  /**
   * This field contains function that receive dataItem and column as argument and return boolean.
   */
  disabledIf?: (dataItem: any, column: IEditGridColumnSetting, isNew?: boolean) => boolean;

  /**
   * This is field name which used for disable cell.
   * Grid checks field and disable content in cell if boolean in dataItem[visibilityField] is true
   */
  disabledField?: string;

  /**
   * If this option is true then field will show only when row is select.
   */
  visibleOnSelect?: boolean;

  /**
   * If this option is true then this field has not validator.
   */
  isNotUseValidation?: boolean;

  /**
   * Settings for action button
   */
  buttonActionSettings?: {
    buttonTemplateType?: ButtonTemplateType;
    classArray?: Array<string>;
    textTranslateKey?: string;
    text?: string;
    disabledIf?: (dataItem: any, column: IEditGridColumnSetting, isNew?: boolean) => boolean;
    icon?: string;
    iconField?: string;
    iconFunction?: (dataItem: any, column: IEditGridColumnSetting, isNew: boolean) => string;
  };

  /**
   * Options for dropdown element
   */
  dropdownOptions?: {
    /**
     * Function that retrieve list of items to select in dropdown
     */
    getListItemsFunction: (...args: any) => Observable<IPaginator<any>>;

    /**
     * Function that retrieve item for show in dropdown
     *
     * @param id
     */
    getOneItemFunction?: (id: string) => Observable<any>;

    /**
     * Name of field from which dropdown show display value.
     */
    textField: string;

    /**
     * Name of field from which dropdown read value.
     */
    valueField: string;
    codeField?: string;

    /**
     * If this field is true then for value in dropdown using primitive as id else object.
     */
    usePrimitiveForBinding?: boolean;

    /**
     * Name of field for validator. If it not set then it will be name of column
     */
    validationFieldName?: string;
  };
}

export type EditGridColumnType = 'text' // just text
  | 'numeric' // numeric as is
  | 'decimal' // #.00
  | 'boolean' // check box
  | 'dropdown'
  | 'date'    // date according date format settings
  | 'date-time'
  | 'time'
  | 'link'   // link to something
  | 'buttonAction'   // some action
  | 'fieldWithCode'   // field with code
  | 'translate-key'; // translation label key
