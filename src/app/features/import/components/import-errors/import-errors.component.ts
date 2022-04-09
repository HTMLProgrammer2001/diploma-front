import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IImportErrorViewModel} from '../../types/view-model/import-error-view-model';
import {LocalPagingAdapter} from '../../../../shared/components/edit-grid-server-paging/local-paging-adapter';
import {IEditGridColumnSetting} from '../../../../shared/types/edit-grid/edit-grid-column-settings';
import {IPaginatorBase} from '../../../../shared/types/paginator-base';

@Component({
  selector: 'cr-import-errors',
  templateUrl: './import-errors.component.html',
  styleUrls: ['./import-errors.component.scss']
})
export class ImportErrorsComponent implements OnChanges {
  @Input() errors: Array<IImportErrorViewModel> = [];

  public localPagingAdapter: LocalPagingAdapter<IImportErrorViewModel> = new LocalPagingAdapter<IImportErrorViewModel>([]);
  public columnSettings: Array<IEditGridColumnSetting> = [
    {
      field: 'row',
      type: 'numeric',
      format: '#',
      titleTranslateKey: 'IMPORT.ERRORS.GRID.ROW'
    },
    {
      field: 'property',
      type: 'text',
      titleTranslateKey: 'IMPORT.ERRORS.GRID.PROPERTY'
    },
    {
      field: 'message',
      type: 'text',
      titleTranslateKey: 'IMPORT.ERRORS.GRID.MESSAGE'
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if(changes.errors) {
      this.localPagingAdapter.setData(this.errors);
    }
  }

  changePage(paginator: IPaginatorBase) {
    this.localPagingAdapter.copyFromPaginator(paginator);
  }
}
