import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-study-and-research',
  templateUrl: './department-study-and-research.component.html'
})
export class DepartmentStudyAndResearchComponent {
  studyAndResearchGroup = signal<any>(null)
  constructor(
    private dashboardService: DashboardService
  ){
    effect(() => {
      if (this.dashboardService.legalAndJudicialStudiesSectorData()) {
        this.studyAndResearchGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'الدراسات والبحوث').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))
      }
    }, { allowSignalWrites: true })
  }

}
