import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departments-form',
  templateUrl: './departments-form.component.html'
})
export class DepartmentsFormComponent {
  store!: AuthState;
  departmentForm!: FormGroup;
  modalType = input<string>();
  @ViewChild('modal22') modal22: any;
  mainLevelDepartments = signal<any>(null);
  closed = output<string>();
  constructor(
    private fb: FormBuilder,
    private storeData: Store<AppState>,
    private secretaryService: SecretaryService
  ) {
    this.initStore();
    effect(() => {
      if (this.modalType() == 'add') {
        this.modal22.open();
        this.initForm();
      } else if (this.modalType() == 'edit') {
        this.modal22.open();
        this.initForm();
        this.departmentForm.patchValue(this.secretaryService.departmentToEdit());
      } else {
        this.modal22.close();
      }
    }, { allowSignalWrites: true })
  }
  ngOnInit() {
    this.secretaryService.getDepartments().subscribe((res: any) => {
      this.mainLevelDepartments.set(res.items.filter((item: any) => item.Level == 'قطاع'));
    });
  }
  initStore() {
    this.storeData
      .select((d) => (
        d.auth
      ))
      .subscribe((d) => {
        this.store = d;
      });
  }
  initForm() {
    this.departmentForm = this.fb.group({
      Name: [''],
      Level: [''],
      ParentID: ['']
    })
  }
  onSubmit() {
    if (this.modalType() == 'add') {
      this.secretaryService.addDepartment(this.departmentForm.value).subscribe((res: any) => {
        const toast: any = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          customClass: { container: 'toast' },
        });
        toast.fire({
          icon: "success",
          title: "تم الاضافة بنجاح",
          padding: '10px 20px',
        });
      })
    } else {
      let payload = this.departmentForm.value
      payload.OrgUnitID = this.secretaryService.departmentToEdit().OrgUnitID
      this.secretaryService.updateDepartment(this.departmentForm.value).subscribe((res: any) => {
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
        this.closed.emit('yes');
        this.modal22.close();
      })
    }
  }
}
