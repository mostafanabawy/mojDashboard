import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html'
})
export class AddDepartmentComponent {
  store!: AuthState
  data = signal<any>(null);
  formTypeToOpen = signal<any>(null);
  cols = [
        { field: 'Name', title: 'اسم الوحدة التنظيمية'},
        { field: 'Level', title: 'مستوى الوحدة'},
        { field: 'action', title: 'الإجراءات' }
    ];
  constructor(
    private secretaryService: SecretaryService,
    private router: Router,
    private storeData: Store<AppState>
  ) {
    this.initStore();
  }
  ngOnInit(){
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
    this.secretaryService.getDepartments().subscribe((res: any) => {
      this.data.set(res.items);
    })
  }
  openEditDepModal(dep : any) {
    this.formTypeToOpen.set('edit');
    this.secretaryService.departmentToEdit.set(dep);
  }
  openDeleteDepModal(dep : any){}
  openAddDepModal() {
    this.formTypeToOpen.set('add');
  }
  onClose(event: any){
    if (event == 'yes') {
      this.setTableData();
    }
  }

}
