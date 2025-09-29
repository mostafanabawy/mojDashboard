import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  private confirmSubject = new Subject<boolean>();
  private messageSubject = new Subject<string>();
  private openSubject = new Subject<boolean>();

  // Expose observables for other components to subscribe to
  confirmResult$: Observable<boolean> = this.confirmSubject.asObservable();
  message$: Observable<string> = this.messageSubject.asObservable();
  openStatus$: Observable<boolean> = this.openSubject.asObservable();

  constructor() { }

  /**
   * Opens the confirmation modal with a given message.
   * Returns an Observable that emits true if confirmed, false if cancelled.
   */
  open(message: string): Observable<boolean> {
    this.messageSubject.next(message);
    this.openSubject.next(true); // Signal to open the modal
    return this.confirmResult$;
  }

  /**
   * Called by the modal component when confirmed.
   */
  confirm() {
    this.openSubject.next(false); // Signal to close the modal
    this.confirmSubject.next(true);
  }

  /**
   * Called by the modal component when cancelled.
   */
  cancel() {
    this.openSubject.next(false); // Signal to close the modal
    this.confirmSubject.next(false);
  }
}
