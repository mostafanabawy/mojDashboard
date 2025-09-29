import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-training-and-qualifications-preparatory',
  templateUrl: './training-and-qualifications-preparatory.component.html',
})
export class TrainingAndQualificationsPreparatoryComponent {
  trainerGroup = signal<any>(null);
  constructor(
    private dashboardService: DashboardService
  ){
    effect(() => {
      if (this.dashboardService.legalAndJudicialStudiesSectorData()) {
        this.trainerGroup.set(
          this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'التدريب والتأهيل الإعدادي').map((item: any) => {
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
