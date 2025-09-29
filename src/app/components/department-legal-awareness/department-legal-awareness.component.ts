import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-legal-awareness',
  templateUrl: './department-legal-awareness.component.html'
})
export class DepartmentLegalAwarenessComponent {

  legalAwarenessGroup = signal<any>(null)
  constructor(
    private dashboardService: DashboardService
  ) {

    effect(() => {
      if (this.dashboardService.legalAndJudicialStudiesSectorData()) {
        this.legalAwarenessGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
        .filter((d: any) => d.GroupName == 'التوعية القانونية').map((item: any) => {
          return {
            statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            statLabel: item.Label
          }
        }))
      }
    }, { allowSignalWrites: true })
  }

}
