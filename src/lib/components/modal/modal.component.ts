import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
  Renderer2,
  Inject,
  ViewEncapsulation,
  PLATFORM_ID
} from '@angular/core';
import { ModalService } from './modal.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-modal',
  template: `
  <div class="sa-modal">
      <div class="sa-modal-body" [ngClass]="class">
          <div class="close" (click)="close()">&times;</div>
          <ng-content></ng-content>
      </div>
  </div>
  <div class="sa-modal-background"></div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './modal.component.scss' ]
})

export class ModalComponent implements OnInit, OnDestroy {

  @Input()
  id: string;

  @Input()
  backgroundClickClose: boolean = false;

  @Input()
  class: string;

  @Output()
  onOpen: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onClose: EventEmitter<boolean> = new EventEmitter();

  private element: any;

  constructor(
    private modalService: ModalService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    let modal = this;
    if (!this.id) {
      return;
    }
    this.renderer.appendChild(this.document.body, this.element);

    // close modal on background click
    if (this.backgroundClickClose) {
      this.element.addEventListener('click', function (e: any) {
        if (e.target.className === 'sa-modal') {
          modal.close();
        }
      });
    }
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.modalService.remove(this.id);
    this.element.remove();
  }

  open(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.element.style.display = 'block';
    this.renderer.addClass(this.document.body, 'sa-modal-open');
    this.onOpen.emit(true);
    this.modalService.emitOpen();
  }

  close(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.element.style.display = 'none';
    this.renderer.removeClass(this.document.body, 'sa-modal-open');
    this.onClose.emit(true);
    this.modalService.emitClose();
  }
}
