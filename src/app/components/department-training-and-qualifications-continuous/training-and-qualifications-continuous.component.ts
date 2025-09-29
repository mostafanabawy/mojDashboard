import { Component, effect, signal } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-department-training-and-qualifications-continuous',
  templateUrl: './training-and-qualifications-continuous.component.html'
})
export class TrainingAndQualificationsContinuousComponent {
  accordingToPlanGroup = signal<any>(null);
  outsidePlanGroup = signal<any>(null);
  organisedForExpertsGroup = signal<any>(null);
  organisedForRealEstateGroup = signal<any>(null);
  constructor(
    private dashboardService: DashboardService
  ) {
    effect(() => {
      if (this.dashboardService.legalAndJudicialStudiesSectorData()) {
        this.accordingToPlanGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'الدورات التدريبية حسب خطة التدريب').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.outsidePlanGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'الدورات التدريبية المستمرة خارج خطة التدريب').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.organisedForExpertsGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'الدورات التدريبية الخاصة بالأحكام المنظمة لأعمال الخبراء').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))

        this.organisedForRealEstateGroup.set(this.dashboardService.legalAndJudicialStudiesSectorData().MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'الدورات التدريبية الخاصة بالأحكام المنظمة لأعمال الوساطة العقارية').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          }))
      }

    }, { allowSignalWrites: true })
  }

}
