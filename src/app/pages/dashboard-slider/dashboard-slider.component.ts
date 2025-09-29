import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DashboardService } from 'src/app/service/dashboard.service';
import { AuthState } from 'src/app/store/auth.reducer';
import { AppState } from 'src/app/types/auth.types';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-dashboard-slider',
  templateUrl: './dashboard-slider.component.html'
})
export class DashboardSliderComponent {
  dashboardSwiper: any;
  timeForm!: FormGroup;
  store!: AuthState;
  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private storeData: Store<AppState>
  ) {
    this.initStore();
    this.initForm();
  }
  ngAfterViewInit() {
    this.initSwiper()
  }
  initSwiper() {
    this.dashboardSwiper = new Swiper('#slider1', {
      modules: [Navigation, Pagination, Autoplay],
      navigation: { nextEl: '.swiper-button-next-ex1', prevEl: '.swiper-button-prev-ex1' },
      /*  pagination: {
         el: '#slider1 .swiper-pagination',
         type: 'bullets',
         clickable: true,
       }, */
      autoplay: { delay: 10000 },
    });
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
    this.timeForm = this.fb.group({
      Month: ['6'],
      Year: ['2024']
    })
  }
  onSubmit() {
    this.dashboardService.getDashboardDataApi(this.timeForm.value.Year, this.timeForm.value.Month, this.store.token!).subscribe((res: any) => {
      for (let index = 0; index < res.tree.length; index++) {
        if (res.tree[index].OrgUnitID == 10) {
          this.dashboardService.realEstateSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 1) {
          this.dashboardService.legalAffairsSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 20) {
          this.dashboardService.financialAffairsSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 30) {
          this.dashboardService.legalAndJudicialStudiesSectorData.set(res.tree[index]);
        }
        if (res.tree[index].OrgUnitID == 40) {
          this.dashboardService.supervisionSectorData.set(res.tree[index]);
        }
      }
      this.dashboardService.dashboardData.set(res);
    });
  }

}
