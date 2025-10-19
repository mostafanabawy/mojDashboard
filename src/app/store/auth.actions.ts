import { createAction, props } from "@ngrx/store";

export const login = createAction(
  '[Auth] Login',
  props<{ Email: string; PasswordHash: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string, user: any}>()
);

export const logout = createAction('[Auth] Logout');

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const ssoLogin = createAction(
  '[Auth] SSO Login',
  props<{ token: string }>() // The token received in the URL query params
);

