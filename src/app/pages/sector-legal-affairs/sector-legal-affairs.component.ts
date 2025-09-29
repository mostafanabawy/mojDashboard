import { Component, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-sector-legal-affairs',
  templateUrl: './sector-legal-affairs.component.html'
})
export class SectorLegalAffairsComponent {
  translationGroup = signal<any>(null);
  translationLast = signal<any>(null);
  expertsDepartmentGroup = signal<any>(null);
  expertsClassificationGroup = signal<any>(null);
  lawyerGroup = signal<any>(null);
  casesStat = signal<any>(null);
  judgementsStat = signal<any>(null);
  contractsStat = signal<any>(null);
  agreementsStat = signal<any>(null);
  
  constructor(public dashboardService: DashboardService, public router: Router) {
    effect(() => {
      if (this.dashboardService.legalAffairsSectorData()) {
        this.translationGroup.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 2).MonthlyTasks[0]?.TaskEntries.filter((d: any) => d.EntryID !== 42006).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )
        this.translationLast.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 2).MonthlyTasks[0]?.TaskEntries.filter((d: any) => d.EntryID == 42006).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )

        this.expertsDepartmentGroup.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'إدارة الخبراء').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )
        this.expertsClassificationGroup.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.GroupName == 'تصنيف الخبراء').map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )

        this.lawyerGroup.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 4).MonthlyTasks[0]?.TaskEntries.map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )

        this.casesStat.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.EntryID == 45005).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )
        this.judgementsStat.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.EntryID == 45006 || d.EntryID == 45007).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )
        this.contractsStat.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.EntryID == 45008).map((item: any) => {
            return {
              statValue: item.Value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              statLabel: item.Label
            }
          })
        )
        this.agreementsStat.set(
          this.dashboardService.legalAffairsSectorData().Children.find((d: any) => d.OrgUnitID == 3).MonthlyTasks[0]?.TaskEntries
          .filter((d: any) => d.EntryID == 45009).map((item: any) => {
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
