import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {Tab} from './popup-tab';

@Component({
  selector: 'cr-popup-tabs',
  templateUrl: './popup-tabs.component.html',
  styleUrls: ['./popup-tabs.component.scss']
})
export class PopupTabsComponent implements OnInit {

  @Input() popupTabs: Array<Tab>;
  @Input() activePopup: number;
  @Output() changeActive = new EventEmitter<number>();
  // @Output() removePopup = new EventEmitter<number>();
  @Output() closePopup = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {

  }

  changeActivePopup(index): void {
    this.changeActive.emit(index);
  }

  removeLastPopup(index): void {
    if (this.activePopup === index) {
      this.changeActive.emit(this.activePopup - 1);
    }
    this.closePopup.emit(index);
  }
}
