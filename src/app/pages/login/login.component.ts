import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { toggleAnimation } from 'src/app/shared/animations';
import * as AuthActions from "../../store/auth.actions"
import { AppState } from 'src/app/types/auth.types';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [toggleAnimation]
})
export class LoginComponent {
  store: any;
  currYear: number = new Date().getFullYear();
  loginForm!: FormGroup
  constructor(
    private storeData: Store<AppState>,
    public translate: TranslateService,
    private appSetting: AppService,
    public router: Router,
    private fb: FormBuilder
  ) {
    this.initStore();
    this.initForm();
  }
  initStore() {
    this.storeData
      .select((d) => ({
        index: d.index,
        auth: d.auth
      }))
      .subscribe((d) => {
        this.store = d;
      });
  }
  changeLanguage(item: any) {
    this.translate.use(item.code);
    this.appSetting.toggleLanguage(item);
    if (this.store.index.locale?.toLowerCase() === 'ae') {
      this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
    } else {
      this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
    }
    window.location.reload();
  }
  initForm() {
    this.loginForm = this.fb.group({
      Email: [''],
      PasswordHash: ['']
    })
  }
  login(){
    if (this.loginForm.valid) {
      this.storeData.dispatch(AuthActions.login(this.loginForm.value));
    }
  }
}
