import { Injectable, signal } from '@angular/core';
import { AuthState } from '../store/auth.reducer';
import { AppState } from '../types/auth.types';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  store!: AuthState;
  dashboardData = signal<any>(null);
  yearData: string = '';
  realEstateSectorData = signal<any>(null);
  legalAffairsSectorData = signal<any>(null);
  financialAffairsSectorData = signal<any>(null);
  legalAndJudicialStudiesSectorData = signal<any>(null);
  supervisionSectorData = signal<any>(null);
  formData = signal<any>(null);
  constructor(
    private storeData: Store<AppState>,
    private http: HttpClient
  ) {
    this.initStore();
    this.storeData.select('auth').subscribe((state: AuthState) => {
      if (state.token) {
        if (state.user?.role == 'Viewer' || state.user?.role == 'Secretary') {
          this.getDashboardDataApi(new Date().getFullYear(), new Date().getMonth() + 1, state.token).subscribe((res: any) => {
            for (let index = 0; index < res.tree.length; index++) {
              if (res.tree[index].OrgUnitID == 10) {
                this.realEstateSectorData.set(res.tree[index]);
              }
              if (res.tree[index].OrgUnitID == 1) {
                this.legalAffairsSectorData.set(res.tree[index]);
              }
              if (res.tree[index].OrgUnitID == 20) {
                this.financialAffairsSectorData.set(res.tree[index]);
              }
              if (res.tree[index].OrgUnitID == 30) {
                this.legalAndJudicialStudiesSectorData.set(res.tree[index]);
              }
              if (res.tree[index].OrgUnitID == 40) {
                this.supervisionSectorData.set(res.tree[index]);
              }
            }
            this.dashboardData.set(res);
          });
        }
        if (state.user?.role == 'Manager' || state.user?.role == 'Secretary') {
          this.getUserEntryScreen(`${this.store.user!.departmentId!}`, state.token).subscribe((res: any) => {
            if (state.user?.role == 'Manager') {
              this.realEstateSectorData.set(res)
            } else {
              this.formData.set(res);
            }
          })
        }
      }
    });
  }
  initStore() {
    this.storeData
      .select((d) => (d.auth))
      .subscribe((d) => {
        this.store = d;
      });
  }

  getDashboardDataApi(year: number, month: number, token: string) {
    this.yearData = year.toString();
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    const headers = new HttpHeaders()
      .set('x-sr-token', token);
    return this.http.get(`${this.baseUrl}/api/dashboard/viewer`, { params, headers });
  }

  getUserEntryScreen(OrgUnitID: string, token: string) {
    const headers = new HttpHeaders()
      .set('x-sr-token', token);
    return this.http.post(`${this.baseUrl}/api/MOJOrgUnitLabels/getpagewithsearch/1/1000/RowId/1`, { OrgUnitID });
  }
}
