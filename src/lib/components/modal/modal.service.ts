import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modals: any[] = [];
  public onEmitClose = new Subject<void>();
  public onEmitClose$ = this.onEmitClose.asObservable();
  public onEmitOpen = new Subject<void>();
  public onEmitOpen$ = this.onEmitOpen.asObservable();

  add(modal: any) {
    this.modals.push(modal);
  }
  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close(id: string) {
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }

  emitClose(): void {
    return  this.onEmitClose.next();
  }

  emitOpen(): void {
    return  this.onEmitOpen.next();
  }
}
