import { Component, effect, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ManagerService } from 'src/app/service/manager.service';
import { SecretaryService } from 'src/app/service/secretary.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entries-form',
  templateUrl: './entries-form.component.html'
})
export class EntriesFormComponent {
  entryForm!: FormGroup;
  store!: AuthState;
  /* entryBlock = input.required<any>(); */
  groupedEntries!: { groupName: string; controls: FormGroup<any>[]; }[];
  saveType: string = '';
  isDisabled = signal(false);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storeData: Store<AppState>,
    private managerService: ManagerService,
    private secretaryService: SecretaryService,
    public dashboardService: DashboardService
  ) {
    this.initStore();
    if (this.store.user?.role == 'Manager') {
      effect(() => {
        if (this.dashboardService.realEstateSectorData()) {
          this.initForm()
        }
      }, { allowSignalWrites: true })
    }
    if (this.store.user?.role == 'Secretary' || this.store.user?.role == 'Manager') {
      effect(() => {
        if (this.dashboardService.formData()) {
          this.initForm()
          if (this.secretaryService.taskData()) {
            this.entryForm.patchValue({
              Year: this.secretaryService.taskData().task.year,
              Month: this.secretaryService.taskData().task.month,
              Entries: this.secretaryService.taskData().entries.map((entry: any) => ({
                GroupName: entry.groupName,
                Label: entry.label,
                Value: entry.value
              }))
            });
          } else {
            router.navigate(['/']);
          }
        }
      }, { allowSignalWrites: true })
    }


    /* this.initForm(); */
    this.dashboardService.getUserEntryScreen('12', this.store.token!).subscribe((res: any) => {
      this.dashboardService.formData.set(res);
      this.initForm();
    })
  }

  initStore() {
    this.storeData
      .select((d) => (
        d.auth
      ))
      .subscribe((d) => {
        this.store = d;
      });
  }
  initForm() {
    const initialEntries = this.getInitialEntries(this.store.user?.role == 'Manager' ? this.dashboardService.realEstateSectorData().result.items : this.dashboardService.formData().result.items);
    this.entryForm = this.fb.group({
      Year: [{ value: new Date().getFullYear(), disabled: true }],
      Month: [{ value: '', disabled: this.store.user?.role == 'Secretary' }],
      Entries: this.fb.array(initialEntries)
    })
    this.groupedEntries = this.groupEntriesByGroupName(initialEntries);

    this.entryForm.get('Year')?.valueChanges.subscribe((value) => {
      this.managerService.getAllEntries().subscribe((res: any) => {
        let monthControl = this.entryForm.get('Month')
        let previousEntry = res.items.find((item: any) => {

          return item.Year == value && item.Month == monthControl?.value && item.OrgUnitID == this.store.user?.departmentId &&
            item.Status === 'تحت الإجراء'
        })
        if (previousEntry) {
          this.isDisabled.set(true);
          let payload = previousEntry;
          delete payload.Status
          delete payload.CreatedDate
          payload.taskID = payload.TaskID
          this.secretaryService.viewTasksApi(payload).subscribe((res: any) => {
            this.entryForm.get('Entries')?.patchValue(res.entries.map((entry: any) => ({
              GroupName: entry.groupName,
              Label: entry.label,
              Value: entry.value
            })))
            /* Entries: this.secretaryService.taskData().entries.map((entry: any) => ({
                GroupName: entry.groupName,
                Label: entry.label,
                Value: entry.value
              })) */
          })
          Swal.fire({
            icon: 'error',
            title: 'هذا الشهر تم إدخال بياناته من قبل',
            showConfirmButton: true,
            confirmButtonText: 'موافق'
          })
        }
      })
    })
    this.entryForm.get('Month')?.valueChanges.subscribe((value) => {
      this.managerService.getAllEntries().subscribe((res: any) => {
        let yearControl = this.entryForm.get('Year')
        let previousEntry = res.items.find((item: any) => {

          return item.Year == yearControl?.value && item.Month == value && item.OrgUnitID == this.store.user?.departmentId && item.Status === 'تحت الإجراء'
        })
        if (previousEntry) {
          this.isDisabled.set(true);
          let payload = previousEntry;
          delete payload.Status
          delete payload.CreatedDate
          payload.taskID = payload.TaskID
          this.secretaryService.viewTasksApi(payload).subscribe((res: any) => {
            this.entryForm.get('Entries')?.patchValue(res.entries.map((entry: any) => ({
              GroupName: entry.groupName,
              Label: entry.label,
              Value: entry.value
            })))
          })
          Swal.fire({
            icon: 'error',
            title: 'هذا الشهر تم إدخال بياناته من قبل',
            showConfirmButton: true,
            confirmButtonText: 'موافق'
          })
        } else {
          this.isDisabled.set(false)
        }
      })
    })
  }

  getInitialEntries(entriesData: any) {
    /* const dummyEntriesData = [
      { GroupName: 'إدارة الوساطة العقارية', Label: 'العدد الكلي للمصالحات', Value: '' },
      { GroupName: 'إدارة الوساطة العقارية', Label: 'العدد الكلي للمخالفات', Value: '' },
      { GroupName: 'إدارة الوساطة العقارية', Label: 'تجديد ترخيص مزاولة اعمال الوساطة العقارية (معنوي/شركات)', Value: '' },
      { GroupName: 'اصدار تراخيص اعمال مزاولة الوساطة العقارية', Label: 'وسيط معنوي شركات', Value: '' },
      { GroupName: 'اصدار تراخيص اعمال مزاولة الوساطة العقارية', Label: 'وسيط طبيعي أفراد', Value: '' },
      { GroupName: 'المناديب المرخصين', Label: 'عدد المناديب', Value: '' },
      { GroupName: 'المناديب المرخصين', Label: 'تجديد الترخيص', Value: '' },
      { GroupName: 'المدراء المرخصين', Label: 'عدد المدراء', Value: '' },
      { GroupName: 'المدراء المرخصين', Label: 'تجديد التراخيص', Value: '' }
    ]; */

    return entriesData.map((entry: any) =>
      this.fb.group({
        GroupName: [entry.GroupName],
        Label: [entry.Label],
        Value: [entry.Value]
      })
    );
  }
  getYearsOptions() {
    const currentYear = new Date().getFullYear();
    const limit = currentYear + 6;
    const years = [];
    for (let year = currentYear; year <= limit; year++) {
      years.push(year);
    }
    return years;
  }
  get entries(): FormArray {
    return this.entryForm.get('Entries') as FormArray;
  }

  getValueControl(control: FormGroup, controlName: string): FormControl {
    return control.get(controlName) as FormControl;
  }
  groupEntriesByGroupName(entries: FormGroup[]) {
    const map = new Map<string, FormGroup[]>();

    for (const fg of entries) {
      const groupName = fg.get('GroupName')?.value || '';
      if (!map.has(groupName)) {
        map.set(groupName, []);
      }
      map.get(groupName)?.push(fg);
    }

    return Array.from(map.entries()).map(([groupName, controls]) => ({
      groupName,
      controls
    }));
  }
  setSaveType(type: string): void {
    this.saveType = type;
  }

  onSubmit() {
    if (this.saveType != 'إرجاع') {
      const entries = this.entryForm.value.Entries.map((entry: any) => ({
        ...entry,
        Value: entry.Value.toString()
      }));

      const payload = {
        OrgUnitID: this.store.user?.departmentId || this.secretaryService.taskData().task.orgUnitID, // append manually
        Status: this.saveType,
        ...this.entryForm.getRawValue(),
        Entries: entries
      };
      this.managerService.saveEntryApi(payload).subscribe((res: any) => {
        const toast: any = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
          customClass: { container: 'toast' },
        });
        toast.fire({
          icon: "success",
          title: "تم إدخال البيانات بنجاح",
          padding: '10px 20px',
        });
        this.entryForm.reset({
          ...this.entryForm.getRawValue(), // keep other values if you want to preserve them
          year: new Date().getFullYear()
        });
        this.router.navigate(['/'])
      },
        (err: any) => {
          console.log(err);
          const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
          });
          toast.fire({
            icon: "error",
            title: "خطاء في التسجيل",
            padding: '10px 20px',
          });
        });

    } else if (this.saveType == 'إرجاع') {
      this.secretaryService.rejectTasksApi(this.secretaryService.taskToEditId()).subscribe((res: any) => {
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
        this.entryForm.reset({
          ...this.entryForm.getRawValue(), // keep other values if you want to preserve them
          year: new Date().getFullYear()
        });
        this.router.navigate(['/tasks-table'])
      })
    }
  }
  ngOnDestroy() {
    this.secretaryService.taskData.set(null); // clear when leaving
  }
}
