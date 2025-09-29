import { Component, input, output, signal, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmModalService } from 'src/app/service/confirm-modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  message = signal<string>('');
  closed = output<string>();
  isOpened = signal<boolean>(false);
  @ViewChild('modal15') modal15: any;
  private destroy$ = new Subject<void>();
  constructor(
    private confirmModalService: ConfirmModalService
  ) { }

  ngOnInit(): void {
    this.confirmModalService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.message.set(message));

    this.confirmModalService.openStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.modal15.open();
      });
  }
  onConfirm() {
    this.confirmModalService.confirm();
    this.modal15.close();
  }

  onCancel() {
    this.confirmModalService.cancel();
    this.modal15.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
