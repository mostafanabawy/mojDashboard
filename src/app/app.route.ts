import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { SectorRealEstateAndDocumnetationComponent } from './pages/sector-real-estate-and-documnetation/sector-real-estate-and-documnetation.component';
import { SectorFinancialAffairsComponent } from './pages/sector-financial-affairs/sector-financial-affairs.component';
import { LoginComponent } from './pages/login/login.component';
import { SectorLegalAffairsComponent } from './pages/sector-legal-affairs/sector-legal-affairs.component';
import { title } from 'process';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SectorLegalAndJudicialStudiesComponent } from './pages/sector-legal-and-judicial-studies/sector-legal-and-judicial-studies.component';
import { SectorSupervisionComponent } from './pages/sector-supervision/sector-supervision.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { DepartmentRealEstateBrokerageComponent } from './components/department-real-estate-brokerage/department-real-estate-brokerage.component';
import { EntriesFormComponent } from './components/entries-form/entries-form.component';
import { SectorTableComponent } from './components/sector-table/sector-table.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { secretaryGuard } from './guards/secretary.guard';
import { managerGuard } from './guards/manager.guard';
import { managerSecretaryGuard } from './guards/manager-secretary.guard';
import { AddDepartmentComponent } from './pages/add-department/add-department.component';
import { DashboardSliderComponent } from './pages/dashboard-slider/dashboard-slider.component';
import { viewerGuard } from './guards/viewer.guard';
import { DraftTableComponent } from './components/draft-table/draft-table.component';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // dashboard
            { path: '', component: DashboardComponent, data: { title: 'Home' } },
            /* { path: 'real-estate-brokerage', component: DepartmentRealEstateBrokerageComponent, data: { title: 'Real Estate and Documentation' } }, */
            { path: 'entries-form', component: EntriesFormComponent, canActivate: [managerSecretaryGuard], data: { title: 'Form' } },
            { path: 'draft-table', component: DraftTableComponent, canActivate: [managerGuard], data: { title: 'Form' } },
            { path: 'tasks-table', component: SectorTableComponent, canActivate: [secretaryGuard], data: { title: 'Tasks' } },
            { path: 'users', component: ProfileComponent, canActivate: [secretaryGuard], data: { title: 'Users' } },
            { path: 'add-department', component: AddDepartmentComponent, canActivate: [secretaryGuard], data: { title: 'Add Department' } },
            { path: 'dashboard-slider', component: DashboardSliderComponent, canActivate: [viewerGuard], data: { title: 'Dashboard Slider' } },
        ],
    },

    {
        path: '',
        component: AuthLayout,
        canActivate: [guestGuard],
        children: [
            { path: 'login', component: LoginComponent, data: { title: 'Login' } },
        ],
    },
];
