import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectorRealEstateAndDocumnetationComponent } from './sector-real-estate-and-documnetation/sector-real-estate-and-documnetation.component';
import { ComponentsModule } from "../components/components.module";
import { SectorFinancialAffairsComponent } from './sector-financial-affairs/sector-financial-affairs.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared.module';
import { IconModule } from '../shared/icon/icon.module';
import { SectorLegalAffairsComponent } from './sector-legal-affairs/sector-legal-affairs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SectorLegalAndJudicialStudiesComponent } from './sector-legal-and-judicial-studies/sector-legal-and-judicial-studies.component';
import { SectorSupervisionComponent } from './sector-supervision/sector-supervision.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { DashboardSliderComponent } from './dashboard-slider/dashboard-slider.component';



@NgModule({
  declarations: [
    SectorRealEstateAndDocumnetationComponent,
    SectorFinancialAffairsComponent,
    LoginComponent,
    SectorLegalAffairsComponent,
    DashboardComponent,
    SectorLegalAndJudicialStudiesComponent,
    SectorSupervisionComponent,
    ProfileComponent,
    AddDepartmentComponent,
    DashboardSliderComponent
  ],
  imports: [
    RouterModule, 
    CommonModule, 
    SharedModule.forRoot(), 
    ComponentsModule, 
    IconModule
  ]
})
export class PagesModule { }
