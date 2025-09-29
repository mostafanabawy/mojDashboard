import { Component, computed, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-human-resources',
  templateUrl: './department-human-resources.component.html'
})
export class DepartmentHumanResourcesComponent {
  humanResourcesDepartment = signal<any>(null)
  yearBudgetGroup = signal<any>(null)
  employeesNumGroup = signal<any>(null)
  firstEmployeesGroup = computed(() => {
    const group = this.employeesNumGroup();
    return Array.isArray(group) && group.length >= 6 ? group.slice(0, 6) : [];
  });

  secondEmployeesGroup = computed(() => {
    const group = this.employeesNumGroup();
    return Array.isArray(group) && group.length > 6 ? group.slice(6, 11) : [];
  });

  constructor(
    private dashboardService: DashboardService
  ) {
    effect(() => {
      if (this.dashboardService.financialAffairsSectorData()) {
        this.humanResourcesDepartment.set(this.dashboardService.financialAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 22))

        this.yearBudgetGroup.set(this.humanResourcesDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == `موازنة العام`).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.employeesNumGroup.set(this.humanResourcesDepartment().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'عدد الموظفين').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))





      }

    }, { allowSignalWrites: true })
  }

}
