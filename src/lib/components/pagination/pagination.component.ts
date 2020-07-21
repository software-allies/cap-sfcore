import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
  <pagination-controls
    id="pagination"
    (pageChange)="pageChange.emit($event)"
    maxSize="9"
    responsive="true"
    previousLabel="Prev"
    nextLabel="Next"
    directionLinks="true"
    auto-hide="true">
  </pagination-controls>
  `,
  styles: [`
  pagination-controls {
    padding: 0 !important;
  }
  `]
})
export class PaginationComponent implements OnInit {

  @Output() pageChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

}
