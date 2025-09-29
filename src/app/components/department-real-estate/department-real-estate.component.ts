import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-real-estate',
  templateUrl: './department-real-estate.component.html',
})
export class DepartmentRealEstateComponent {
  realEstateDepartmentData = signal<any>(null);
  buyAndSellGroup = signal<any>(null);
  mortgageGroup = signal<any>(null);
  constructor(
    public dashboardService: DashboardService
  ) {
    effect(() => {
      if (this.dashboardService.realEstateSectorData()) {
        this.realEstateDepartmentData.set(
          this.dashboardService.realEstateSectorData().Children.find((d: any) => d.OrgUnitID == 13)
        )
        this.buyAndSellGroup.set(
          this.realEstateDepartmentData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => d.GroupName == 'عمليات البيع والشراء').map((item: any) => {
            return {
              statLabel: item.Label,
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          })
        )
        this.mortgageGroup.set(
          this.realEstateDepartmentData().MonthlyTasks[0]?.TaskEntries.filter((d: any) => d.GroupName == 'عمليات الرهن').map((item: any) => {
            return {
              statLabel: item.Label,
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          })
        )
      }
    }, { allowSignalWrites: true })
  }

}
