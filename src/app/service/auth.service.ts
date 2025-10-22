import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  login(Email: string, PasswordHash: string): Observable<any> {
    console.log('login service triggered');
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { Email, PasswordHash }).pipe(
      map(res => res)
    );
  }

  chooseLoginService(){
    return this.http.get<any>(`${this.baseUrl}/api/MOJUsers/ssoinfo`);
  }

  ssoLogin(token: string){
    return this.http.get<any>(`${this.baseUrl}/api/MOJUsers/ssologin/${token}`);
  }

  
}
