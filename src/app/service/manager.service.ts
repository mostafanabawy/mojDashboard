import { Injectable } from '@angular/core';
import { AuthState } from '../store/auth.reducer';
import { AppState } from '../types/auth.types';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  store!: AuthState;
  baseUrl = environment.apiUrl;
  constructor(
    private storeData: Store<AppState>,
    private http: HttpClient
  ) {
    this.initStore();
  }
  initStore() {
    this.storeData
      .select((d) => (d.auth))
      .subscribe((d) => {
        this.store = d;
      });
  }

  saveEntryApi(payload: any) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJMonthlyTasks/saveEntry`, payload,
      { headers }
    );
  }

  getAllEntries(){
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.get(`${this.baseUrl}/api/MOJMonthlyTasks/selectall`)
  }

}
