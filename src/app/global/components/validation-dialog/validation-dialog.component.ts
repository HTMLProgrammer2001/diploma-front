import {Component, Input, OnInit} from '@angular/core';
import {Validator} from '../../../shared/types/validation/validator';

@Component({
  selector: 'cr-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.scss']
})
export class ValidationDialogComponent implements OnInit {
  @Input() validator: Validator;
  constructor() { }

  ngOnInit(): void {
  }

}
