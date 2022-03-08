import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  selector: 'cr-grid-paginator',
  templateUrl: './grid-paginator.component.html',
  styleUrls: ['./grid-paginator.component.scss']
})
export class GridPaginatorComponent implements AfterViewInit {
  @Input() sizes: Array<number> = [5,10,20,100];
  @Input() totalElements: number;

  @ViewChild('paging') pagingComponent: ElementRef;

  ngAfterViewInit(): void {
    this.pagingComponent?.nativeElement.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
  }
}
