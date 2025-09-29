import { Component, effect, input, output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecretaryService } from 'src/app/service/secretary.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-change-pass-modal',
  templateUrl: './change-pass-modal.component.html'
})
export class ChangePassModalComponent {
  closed = output<string>();
  isOpened = input.required<any>();
  userForm!: FormGroup;
  flagged = input.required<string>();
  @ViewChild('modal12') modal12: any;

  constructor(
    private secretaryService: SecretaryService,
    private fb: FormBuilder
  ) {
    effect(() => {
      console.log('isOpened', this.isOpened());
      console.log('flagged', this.flagged());
      const trigger = this.isOpened();
      if (this.flagged() == 'yes') {
        this.modal12?.open();
      } else {
        this.modal12?.close();
      }
    }, { allowSignalWrites: true });
    this.initForm();
  }
  initForm(){
    this.userForm = this.fb.group({
      CurrentPassword: [''],
      NewPassword: ['']
    });
  }
  onSubmit() {
    this.secretaryService.resetPassword({...this.userForm.value, UserID: Number(this.secretaryService.userToEdit().UserID)}).subscribe((res: any) => {
      console.log(res);
      if (res.result == 'OK') {
        this.modal12?.close();
        const toast: any = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          customClass: { container: 'toast' },
        });
        toast.fire({
          icon: "success",
          title: "تم التسجيل بنجاح",
          padding: '10px 20px',
        });
        this.closed.emit('no');
      }
    })
  }
}
