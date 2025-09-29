import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SecretaryService } from 'src/app/service/secretary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html'
})
export class UsersModalComponent {
  closed = output<string>();
  isOpened = input.required<any>();
  modalType = input.required<string>();
  private firstButton: HTMLButtonElement | null = null;
  userForm!: FormGroup;
  departmentsOptions = signal<any>(null);
  @ViewChild('modal11') modal11: any;
  constructor(private fb: FormBuilder,
    private secretaryService: SecretaryService
  ) {
    effect(() => {
      const trigger = this.isOpened();
      const type = this.modalType();

      if (type == 'add') {
        this.userForm.reset()
        this.modal11?.open();
      } else if (type === 'edit') {
        this.modal11?.open();
      } else {
        this.modal11?.close();
      }
    }, { allowSignalWrites: true })
    effect(() => {
      if (this.secretaryService.userToEdit() && (this.modalType() == 'edit' || this.modalType() == 'add')) {
        let department = this.departmentsOptions().find((item: any) => item.OrgUnitID == this.secretaryService.userToEdit().DepartmentId)
        this.userForm.patchValue({
          ...this.secretaryService.userToEdit(),
          DepartmentName: `${department.Name};${department.OrgUnitID};${department.ParentID};${department.Level}`
        });
      }
    }, { allowSignalWrites: true })
  }
  ngOnInit() {
    this.secretaryService.getDepartments().subscribe((res: any) => {
      this.departmentsOptions.set(res.items)
    });
  }
  ngAfterViewInit() {
    this.initForm();
    this.onModalOpened();
  }
  initForm() {
    this.userForm = this.fb.group({
      FullName: [''],
      Email: [''],
      PasswordHash: [''],
      Role: [''],
      IsActive: [true],
      Mobile: [''],
      DepartmentName: ['']
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      let payload = this.userForm.value;
      const [name, orgUnitID, parentID, level] = payload.DepartmentName.split(';');
      payload = {
        ...payload,
        IsActive: !!this.userForm.value.IsActive,
        DepartmentName: name,
        DepartmentId: Number(orgUnitID),
      };
      if (level == 'إدارة') {
        payload.ParentID = Number(parentID);
      } else {
        payload.ParentID = null;
      }

      if (this.modalType() == 'add') {
        this.secretaryService.insertUser(payload).subscribe((res: any) => {
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

        },
          (err: any) => {
            console.log(err);
            const toast: any = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
              customClass: { container: 'toast' },
            });
            toast.fire({
              icon: "error",
              title: "فشل التسجيل",
              padding: '10px 20px',
            });
          })
      } else {
        payload.UserID = this.secretaryService.userToEdit().UserID
        delete payload.PasswordHash
        delete payload.ParentID
        if (payload.Mobile == 'لا يوجد') {
          payload.Mobile = null
        }
        this.secretaryService.editUser(payload).subscribe((res: any) => {
          const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
          });
          toast.fire({
            icon: "success",
            title: "تم التعديل بنجاح",
            padding: '10px 20px',
          });
        },
          (err: any) => {
            console.log(err);
            const toast: any = Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
              customClass: { container: 'toast' },
            });
            toast.fire({
              icon: "error",
              title: "فشل التعديل",
              padding: '10px 20px',
            });
          })
      }
      this.userForm.reset();
      this.onUserClose('no');
    }
  }
  onUserClose(answer: string) {
    this.userForm.reset()
    this.closed.emit(answer);
  }
  onModalOpened() {
    setTimeout(() => {
      this.firstButton = document.querySelector('.modal-header button') as HTMLButtonElement | null;
      this.firstButton?.addEventListener('click', () => this.onUserClose('no'));
      this.firstButton?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.onUserClose('no');
        }
      });
      this.firstButton?.focus();
    });
  }
}
