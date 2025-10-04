import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-documentation',
  templateUrl: './department-documentation.component.html'
})
export class DepartmentDocumentationComponent {
  documentationDataGroup = signal<any>(null);
  constructor(public dashboardService: DashboardService) {
    effect(() => {
      if (this.dashboardService.realEstateSectorData()) {
        this.documentationDataGroup.set(
          this.dashboardService.realEstateSectorData().Children?.find((d: any) => d.OrgUnitID == 11).MonthlyTasks[0]?.TaskEntries.map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )

      }

    }, { allowSignalWrites: true })
  }
}
