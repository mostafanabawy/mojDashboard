import { Component, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';

@Component({
  selector: 'app-department-real-estate-brokerage',
  templateUrl: './department-real-estate-brokerage.component.html'
})
export class DepartmentRealEstateBrokerageComponent {
  store!: AuthState;
  role = signal<"Manager" | "Viewer" | "Secretary" | null>(null);
  realEstateBrokerageData = signal<any>(null);
  brokerageGroup = signal<any>(null);
  brokerageLicenseGroup = signal<any>(null);
  managersGroup = signal<any>(null);
  representativesGroup = signal<any>(null);
  timeForm!: FormGroup;
  constructor(
    public dashboardService: DashboardService,
    public storeData: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.initStore();
    this.initForm();


    effect(() => {
      if (this.dashboardService.realEstateSectorData()) {
        if (this.role() == 'Manager') {
          this.realEstateBrokerageData.set(
            this.dashboardService.realEstateSectorData()
          )

        } else if (this.role() == 'Viewer' || this.role() == 'Secretary') {
          this.realEstateBrokerageData.set(
            this.dashboardService.realEstateSectorData().Children?.find((d: any) => d.OrgUnitID == 12)
          )

          this.brokerageGroup.set(
            this.realEstateBrokerageData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => {
              return d.GroupName == "إدارة الوساطة العقارية"
            }).map((item: any) => {
              return {
                statLabel: item.Label,
                statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            })
          )
          this.brokerageLicenseGroup.set(
            this.realEstateBrokerageData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => {
              return d.GroupName == "اصدار تراخيص اعمال مزاولة الوساطة العقارية"
            }).map((item: any) => {
              return {
                statLabel: item.Label,
                statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            })
          )
          this.managersGroup.set(
            this.realEstateBrokerageData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => {
              return d.GroupName == "المدراء المرخصين"
            }).map((item: any) => {
              return {
                statLabel: item.Label,
                statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            })
          )
          this.representativesGroup.set(
            this.realEstateBrokerageData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => {
              return d.GroupName == "المناديب المرخصين"
            }).map((item: any) => {
              return {
                statLabel: item.Label,
                statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            })
          )

        }

      }
    }, { allowSignalWrites: true })
  }
  initStore() {
    this.storeData
      .select((d) => d.auth)
      .subscribe((d) => {
        this.store = d;
        this.role.set(this.store.user?.role as "Manager" | "Viewer" | null);
      });
  }
  initForm() {
    this.timeForm = this.fb.group({
      Month: [''],
      Year: ['']
    })
  }

  onSubmit() {
    this.dashboardService.getUserEntryScreen({ ...this.timeForm.value, OrgUnitID: 12 }, this.store.token!).subscribe((res: any) => {
      this.realEstateBrokerageData.set(res);
    })
  }
}
