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

