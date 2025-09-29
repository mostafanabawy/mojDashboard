import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-sector-legal-and-judicial-studies',
  templateUrl: './sector-legal-and-judicial-studies.component.html'
})
export class SectorLegalAndJudicialStudiesComponent {

  constructor(public dashboardService: DashboardService) { }
}
