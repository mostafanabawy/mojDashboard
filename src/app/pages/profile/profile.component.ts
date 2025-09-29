import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { ConfirmModalService } from 'src/app/service/confirm-modal.service';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  store!: AuthState
  search5 = '';
  isModal = signal(0);
  isModal2 = signal(0);
  cols = [
    { field: 'DepartmentId', title: 'معرف الادارة' },
    { field: 'DepartmentName', title: 'اسم الادارة' },
    { field: 'Email', title: 'البريد الالكتروني' },
    { field: 'FullName', title: 'الاسم كامل' },
    { field: 'IsActive', title: 'الحالة' },
    { field: 'Mobile', title: 'الجوال' },
    { field: 'Role', title: 'الدور' },
    { field: 'action', title: 'الإجراءات' }
  ];
  totalRows = signal<any>(null);
  pageSize = signal<any>(null);
  data = signal<any>(null);
  setModalType = signal<any>(null)
  setModalType2 = signal<any>(null)
  constructor(
    private secretaryService: SecretaryService,
    private router: Router,
    private storeData: Store<AppState>,
    private confirmModalService: ConfirmModalService
  ) {
    this.initStore();
  }
  ngOnInit() {
    this.setTableData();
  }
  initStore() {
    this.storeData
      .select((d) => (d.auth))
      .subscribe((d) => {
        this.store = d;
      });
  }
  setTableData(page?: number) {
    this.secretaryService.getUsers(page).subscribe((res: any) => {
      this.data.set(
        res.result.items.map((item: any) => {
          delete item.PasswordHash
          for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
              item[key] = item[key] || 'لا يوجد';

            }
          }
          return item
        })
      )

      this.totalRows.set(res.result.PagingInfo[0].TotalRows)
      this.pageSize.set(res.result.PagingInfo[0].PageSize)

    })
  }
  openAddUserModal() {
    this.setModalType.set('add')
    this.isModal.update(n => n + 1);
  }
  openEditUserModal(user: any) {
    this.secretaryService.userToEdit.set(user)
    this.setModalType.set('edit')
    this.isModal.update(n => n + 1);

  }
  onServerChange(event: any) {
    switch (event.change_type) {
      case 'page':
        this.setTableData(event.current_page)
        break;
    }
  }
  onUserClose(event: any) {
    if (event == 'no') {
      this.isModal.update(n => n * 0);
      this.setTableData()
    }
  }
  onPassClose(event: any) {
    if (event == 'no') {
      this.isModal2.update(n => n * 0);
      this.setTableData()
    }
  }
  deleteUser(user: any) {
    this.confirmModalService.open('هل تريد حذف هذا المستخدم؟')
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            // Simulate API call
            return this.secretaryService.deleteUser(Number(user)); // Return an observable that immediately completes
          } else {
            return of(null);
          }
        })
      )
      .subscribe((res: any) => {
        if (res.result.result == 'OK') {
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
          this.setTableData()
        }
      })

   /*  this.secretaryService.deleteUser(Number(user)).subscribe((res: any) => {
      console.log(res);
      if (res.result.result == 'OK') {
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
        this.setTableData()
      }
    }) */
  }
  resetPassword(user: any) {
    this.isModal2.update(n => n + 1);
    this.setModalType2.set('yes')
    this.secretaryService.userToEdit.set(user)
  }
}
