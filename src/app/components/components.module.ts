import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { IconModule } from '../shared/icon/icon.module';
import { DepartmentRealEstateComponent } from './department-real-estate/department-real-estate.component';
import { StatsBlockComponent } from './stats-block/stats-block.component';
import { DepartmentRealEstateBrokerageComponent } from './department-real-estate-brokerage/department-real-estate-brokerage.component';
import { DepartmentDocumentationComponent } from './department-documentation/department-documentation.component';
import { DepartmentFinancialAdministrativeAffairsComponent } from './department-financial-administrative-affairs/department-financial-administrative-affairs.component';
import { DepartmentHumanResourcesComponent } from './department-human-resources/department-human-resources.component';
import { SectorTableComponent } from './sector-table/sector-table.component';
import { TrainingAndQualificationsContinuousComponent } from './department-training-and-qualifications-continuous/training-and-qualifications-continuous.component';
import { TrainingAndQualificationsPreparatoryComponent } from './department-training-and-qualifications-preparatory/training-and-qualifications-preparatory.component';
import { DepartmentLegalAwarenessComponent } from './department-legal-awareness/department-legal-awareness.component';
import { DepartmentStudyAndResearchComponent } from './department-study-and-research/department-study-and-research.component';
import { EntriesFormComponent } from './entries-form/entries-form.component';
import { UsersModalComponent } from './users-modal/users-modal.component';
import { ChangePassModalComponent } from './change-pass-modal/change-pass-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { DepartmentsFormComponent } from './departments-form/departments-form.component';
import { DraftTableComponent } from './draft-table/draft-table.component';
import { UnderReviewTableComponent } from './under-review-table/under-review-table.component';



@NgModule({
  imports: [
     CommonModule, SharedModule.forRoot(), IconModule
  ],
  declarations: [
    DepartmentRealEstateComponent,
    StatsBlockComponent,
    DepartmentRealEstateBrokerageComponent,
    DepartmentDocumentationComponent,
    DepartmentFinancialAdministrativeAffairsComponent,
    DepartmentHumanResourcesComponent,
    SectorTableComponent,
    TrainingAndQualificationsContinuousComponent,
    TrainingAndQualificationsPreparatoryComponent,
    DepartmentLegalAwarenessComponent,
    DepartmentStudyAndResearchComponent,
    EntriesFormComponent,
    UsersModalComponent,
    ChangePassModalComponent,
    ConfirmModalComponent,
    DepartmentsFormComponent,
    DraftTableComponent,
    UnderReviewTableComponent
  ],
  exports: [
    DepartmentRealEstateComponent,
    UnderReviewTableComponent,
    StatsBlockComponent,
    DepartmentRealEstateBrokerageComponent,
    DepartmentDocumentationComponent,
    DepartmentFinancialAdministrativeAffairsComponent,
    DepartmentHumanResourcesComponent,
    SectorTableComponent,
    TrainingAndQualificationsContinuousComponent,
    TrainingAndQualificationsPreparatoryComponent,
    DepartmentLegalAwarenessComponent,
    DepartmentStudyAndResearchComponent,
    EntriesFormComponent,
    UsersModalComponent,
    ChangePassModalComponent,
    ConfirmModalComponent,
    DepartmentsFormComponent,
    DraftTableComponent
  ]
})
export class ComponentsModule { }
