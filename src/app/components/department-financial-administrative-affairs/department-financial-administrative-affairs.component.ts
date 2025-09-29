import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-financial-administrative-affairs',
  templateUrl: './department-financial-administrative-affairs.component.html'
})
export class DepartmentFinancialAdministrativeAffairsComponent {
  financialAndAdministrativeAffairsDepartment = signal<any>(null)
  projectsStatisticsGroupMore = signal<any>(null)
  projectsStatisticsGroupLess = signal<any>(null)
  yearBudgetGroup = signal<any>(null)
  profitsGroup = signal<any>(null)
  constructor(
    public dashboardService: DashboardService
  ) {
    effect(() => {
      if (this.dashboardService.financialAffairsSectorData()) {
        this.financialAndAdministrativeAffairsDepartment.set(this.dashboardService.financialAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 21))

        this.projectsStatisticsGroupLess.set(this.financialAndAdministrativeAffairsDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'احصائيات المشاريع الأقل من 200 ألف').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.projectsStatisticsGroupMore.set(this.financialAndAdministrativeAffairsDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'احصائيات المشاريع الأعلى من 200 ألف').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.yearBudgetGroup.set(this.financialAndAdministrativeAffairsDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == `موازنة العام`).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.profitsGroup.set(this.financialAndAdministrativeAffairsDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName.includes(`الإيرادات المحصلة`)).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))


      }

    }, { allowSignalWrites: true })
  }
}
