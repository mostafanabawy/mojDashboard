import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-sector-financial-affairs',
  templateUrl: './sector-financial-affairs.component.html'
})
export class SectorFinancialAffairsComponent {
  constructor(
    public router: Router,
    public dashboardService: DashboardService
  ){}
}
