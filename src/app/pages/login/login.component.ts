import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { toggleAnimation } from 'src/app/shared/animations';
import * as AuthActions from "../../store/auth.actions"
import { AppState } from 'src/app/types/auth.types';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [toggleAnimation]
})
export class LoginComponent {
  store: any;
  currYear: number = new Date().getFullYear();
  loginForm!: FormGroup
  isForm: boolean = false;
  constructor(
    private storeData: Store<AppState>,
    public translate: TranslateService,
    private appSetting: AppService,
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initStore();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      console.log('NGONINIT: Checking for token. Found:', !!token);

      if (token) {
        // 1. Dispatch the action
        console.log('NGONINIT: Token found. Dispatching ssoLogin action.');
        this.storeData.dispatch(AuthActions.ssoLogin({ token }));

        // 2. 🛑 CRITICAL FIX: Wrap the router cleanup in setTimeout(0).
        // This ensures the action dispatch is fully processed before we change the URL,
        // which prevents the component's ngOnDestroy/ngOnInit from racing the cleanup.
        setTimeout(() => {
          console.log('NGONINIT: Clearing token from URL.');
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { token: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          }).then(success => {
            console.log('NGONINIT: URL cleanup complete:', success);
          });
        }, 0);

      } else {
        // If no token, proceed to determine the login method (API 1)
        console.log('NGONINIT: No token found. Calling chooseLoginMethod.');
        this.chooseLoginMethod();
      }
    });
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
  formGroup: FormGroup = new FormGroup({});
  initForm() {
    this.loginForm = this.fb.group({
      Email: [''],
      PasswordHash: ['']
    })
  }
  login() {
    if (this.loginForm.valid) {
      this.storeData.dispatch(AuthActions.login(this.loginForm.value));
    }
  }
  externalURL = '';
  chooseLoginMethod() {
    this.authService.chooseLoginService().subscribe(res => {
      console.log(res)
      if (res.LoginType === 'form') {
        this.isForm = true;
        this.initForm();
      } else if (res.LoginType === 'azure') {
        this.isForm = false;
        const redirectUrl = res.AzureSSOURL;
        this.externalURL = redirectUrl;
      }
    });
  }

  loginWithMinistryAccount() {
    if (this.externalURL) {
      // Redirect the user to the external SSO link
      // This will leave your Angular app and go to the Azure/SSO provider.
      window.location.href = this.externalURL;
    } else {
      console.error('Azure LoginType returned but no RedirectUrl provided.');
      this.initForm(); // Fallback to form login or show an error
    }
  }

}
