import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-sector-supervision',
  templateUrl: './sector-supervision.component.html'
})
export class SectorSupervisionComponent {
  focusOnGroup = signal<any>(null)
  constructor(
    public dashboardService: DashboardService
  ){
    effect(() => {
      if(this.dashboardService.supervisionSectorData()){
        this.focusOnGroup.set(
          this.dashboardService.supervisionSectorData().MonthlyTasks[0]?.TaskEntries.map((item: any) => {
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
