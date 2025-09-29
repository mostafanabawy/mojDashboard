import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AppState } from '../types/auth.types';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth.reducer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecretaryService {
  baseUrl = environment.apiUrl;
  store!: AuthState;
  taskData = signal<any>(null) // task under procedure selected
  userToEdit = signal<any>(null) // user to edit
  taskToEditId = signal<any>(null) // task to edit id only
  departmentToEdit = signal<any>(null)
  constructor(
    private http: HttpClient,
    private storeData: Store<AppState>
  ) {
    this.initStore();
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

  getInProgressTasksApi() {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.get(`${this.baseUrl}/api/MOJMonthlyTasks/inprogress`,
      { headers }
    );
  }

  approveTasksApi(TaskID: number) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJMonthlyTasks/approve`,
      { TaskID },
      { headers }
    );
  }

  rejectTasksApi(TaskID: number) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJMonthlyTasks/return`,
      { TaskID },
      { headers }
    );
  }
  viewTasksApi({ taskID, OrgUnitID, Year, Month }: { taskID: number, OrgUnitID: number, Year: number, Month: number }) {
    this.taskToEditId.set(taskID);
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJMonthlyTasks/getTaskEntryData`,
      { taskID, OrgUnitID, Year, Month },
      { headers }
    );
  }

  getUsers(page = 1) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJUsers/getpagewithsearch/${page}/10/UserID/2`,
      {}, { headers }
    );
  }
  insertUser(payload: any) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJUsers/insert`,
      payload, { headers }
    );
  }

  editUser(payload: any) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJUsers/update`,
      payload, { headers }
    );
  }

  deleteUser(id: any) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJUsers/delete/${id}`,
      {}, { headers }
    );
  }

  resetPassword(user: any) {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJUsers/changePassword`,
      user, { headers }
    );
  }

  getDepartments() {
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.get(`${this.baseUrl}/api/MOJOrgUnits/selectall`,
      { headers }
    );
  }

  addDepartment(payload: any){
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJOrgUnits/insert`, payload, 
      { headers }
    )
  }

  updateDepartment(payload: any){
    const headers = new HttpHeaders().set('x-sr-token', this.store.token!);
    return this.http.post(`${this.baseUrl}/api/MOJOrgUnits/update`, payload,
      { headers }
    )
  }

}
