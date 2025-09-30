import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { ConfirmModalService } from 'src/app/service/confirm-modal.service';
import { ManagerService } from 'src/app/service/manager.service';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';

@Component({
  selector: 'app-draft-table',
  templateUrl: './draft-table.component.html'
})
export class DraftTableComponent {
  store!: AuthState
  search5 = '';
  cols = [
    { field: 'TaskID', title: 'معرف المهمة', isUnique: true },
    { field: 'OrgUnitID', title: 'معرف الوحدة التنظيمية' },
    { field: 'Year', title: 'السنة' },
    { field: 'Month', title: 'الشهر' },
    { field: 'action', title: 'الإجراءات' }
  ];
  rows = signal<any>([]);
  data = signal<any>(null);
  constructor(
    private router: Router,
    private storeData: Store<AppState>,
    private confirmModalService: ConfirmModalService,
    private managerService: ManagerService,
    private secretaryService: SecretaryService
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
  refreshData() {
    this.setTableData();
  }
  approve(taskID: number) {

  }
  reject(taskID: number) {
    this.confirmModalService.open('هل تريد إرجاع هذه المهمة؟')
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            // Simulate API call// Return an observable that immediately completes
            return of(true)
          } else {
            return of(null);
          }
        })
      )
      .subscribe((res: any) => {
       
      })
  }
  
  view(taskID: number, Year: number, Month: number, orgUnitID: number) {
    this.secretaryService.viewTasksApi({ taskID, OrgUnitID: orgUnitID, Year, Month }).subscribe((res: any) => {
      this.secretaryService.taskData.set(res);
      this.router.navigate(['/entries-form']);
    })
  }
  setTableData() {
    this.managerService.getAllEntries().subscribe((res: any) => {
      let data  = res.items.filter((item: any)=> {
        return item.OrgUnitID == this.store.user?.departmentId  && item.Status === 'لم يبدأ'
      })
      console.log(data);
      this.rows.set(data)
    })
    
  }
}
