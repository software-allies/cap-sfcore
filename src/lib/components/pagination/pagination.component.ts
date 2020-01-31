import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
  <div class="d-flex justify-content-center">
    <pagination-controls
      id="pagination"
      (pageChange)="pageChange.emit($event)"
      maxSize="9"
      responsive="false"
      previousLabel="Previous"
      nextLabel="Next"
      directionLinks="true"
      auto-hide="true">
    </pagination-controls>
  </div>
  `,
  styles: [``]
})
export class PaginationComponent implements OnInit {

  @Output() pageChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

}
