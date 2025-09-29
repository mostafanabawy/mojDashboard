import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-sector-real-estate-and-documnetation',
  templateUrl: './sector-real-estate-and-documnetation.component.html'
})
export class SectorRealEstateAndDocumnetationComponent {
  constructor(
    public dashboardService: DashboardService,
  ) {
  }
}


