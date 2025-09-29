import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

// service
import { AppService } from 'src/app/service/app.service';

// i18n
import { TranslateModule } from '@ngx-translate/core';

// perfect-scrollbar
import { NgScrollbarModule, provideScrollbarOptions } from 'ngx-scrollbar';

// headlessui
import { MenuModule } from 'headlessui-angular';

// icons
import { IconModule } from 'src/app/shared/icon/icon.module';

// flatpicker
import { FlatpickrModule } from 'angularx-flatpickr';
// modal
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { A11yModule } from '@angular/cdk/a11y';
// datatable
import { DataTableModule } from '@bhplugin/ng-datatable';

// apexchart
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslateModule.forChild(), NgScrollbarModule, MenuModule, IconModule,
        FlatpickrModule,
        NgxCustomModalComponent,
        A11yModule,
        DataTableModule,
        NgApexchartsModule
    ],
    declarations: [],
    exports: [
        // modules
        FormsModule,
        ReactiveFormsModule,

        TranslateModule,
        NgScrollbarModule,
        MenuModule,
        IconModule,
        FlatpickrModule,
        NgxCustomModalComponent,
        A11yModule,
        DataTableModule,
        NgApexchartsModule
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: SharedModule,
            providers: [
                Title,
                AppService,
                provideScrollbarOptions({
                    visibility: 'hover',
                    appearance: 'compact',
                }),
            ],
        };
    }
}
