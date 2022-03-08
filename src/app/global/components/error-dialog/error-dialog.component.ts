import {Component, Input, OnInit} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';
import {ErrorViewModel} from '../../../shared/types/error-view-model';

@Component({
  selector: 'cr-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  @Input() errors: Array<ErrorViewModel>;
  constructor() { }

  ngOnInit(): void {
  }

}

