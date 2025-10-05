import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { ConfirmModalService } from 'src/app/service/confirm-modal.service';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sector-table',
    templateUrl: './sector-table.component.html'
})
export class SectorTableComponent {
    store!: AuthState
    search5 = '';
    cols = [
        { field: 'taskID', title: 'معرف المهمة', isUnique: true },
        { field: 'orgUnitID', title: 'معرف الوحدة التنظيمية' },
        { field: 'orgUnitName', title: 'اسم الوحدة التنظيمية' },
        { field: 'managerName', title: 'اسم المدير' },
        { field: 'year', title: 'السنة' },
        { field: 'month', title: 'الشهر' },
        { field: 'status', title: 'الحالة' },
        { field: 'action', title: 'الإجراءات' }
    ];
    /* { field: 'managerEmail', title: 'البريد الإلكتروني للمدير' }, */
    rows = signal<any>([]);
    data = signal<any>(null);
    constructor(
        private secretaryService: SecretaryService,
        private router: Router,
        private storeData: Store<AppState>,
        private confirmModalService: ConfirmModalService
    ) {
        this.initStore();
    }
    ngOnInit() {
        this.setTableData();
    }
    initStore() {
        this.storeData
            .select((d) => (d.auth))
            .subscribe((d) => {
                this.store = d;
            });
    }
    refreshData() {
        this.setTableData();
    }
    reject(taskID: number) {
        this.confirmModalService.open('هل تريد إرجاع هذه المهمة؟')
            .pipe(
                switchMap(confirmed => {
                    if (confirmed) {
                        // Simulate API call
                        return this.secretaryService.rejectTasksApi(taskID); // Return an observable that immediately completes
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((res: any) => {
                this.refreshData();
                const toast: any = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: { container: 'toast' },
                });
                toast.fire({
                    icon: "success",
                    title: "تم الإرجاع بنجاح",
                    padding: '10px 20px',
                });
            })
        /* this.secretaryService.rejectTasksApi(taskID).subscribe((res: any) => {
            this.refreshData();
            const toast: any = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                customClass: { container: 'toast' },
            });
            toast.fire({
                icon: "success",
                title: "تم الإرجاع بنجاح",
                padding: '10px 20px',
            });
        }) */
    }
    approve(taskID: number) {
        this.confirmModalService.open('هل تريد الموافقة على هذه المهمة؟')
            .pipe(
                switchMap(confirmed => {
                    if (confirmed) {
                        // Simulate API call
                        return this.secretaryService.approveTasksApi(taskID); // Return an observable that immediately completes
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe((res: any) => {
                this.refreshData();
                const toast: any = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3000,
                    customClass: { container: 'toast' },
                });
                toast.fire({
                    icon: "success",
                    title: "تم الموافقة بنجاح",
                    padding: '10px 20px',
                });
            })
        /* this.secretaryService.approveTasksApi(taskID).subscribe((res: any) => {
            this.refreshData();
            const toast: any = Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                customClass: { container: 'toast' },
            });
            toast.fire({
                icon: "success",
                title: "تم الموافقة بنجاح",
                padding: '10px 20px',
            });
        }) */
    }
    view(taskID: number, Year: number, Month: number, orgUnitID: number) {
        this.secretaryService.viewTasksApi({ taskID, OrgUnitID: orgUnitID, Year, Month }).subscribe((res: any) => {
            this.secretaryService.taskData.set(res);
            this.router.navigate(['/entries-form']);
        })
    }
    setTableData() {
        this.secretaryService.getInProgressTasksApi().subscribe((res: any) => {
            if (res.result == 'OK') {
                console.log(res.items);
                this.data.set(res.items);
            }
        })
    }
}
