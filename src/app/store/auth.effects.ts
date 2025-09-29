import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from "rxjs";
import Swal from 'sweetalert2';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService, @Inject(Router) private router: Router) { }
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ Email, PasswordHash }) => this.authService.login(Email, PasswordHash).pipe(
                map((response) => {
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('user', JSON.stringify(response.user));
                    console.log(response);
                    const toast: any = Swal.mixin({
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: { container: 'toast' },
                    });
                    toast.fire({
                        icon: "success",
                        title: "تم تسجيل الدخول بنجاح",
                        padding: '10px 20px',
                    });
                    this.router.navigate(['/']);
                    return AuthActions.loginSuccess({ token: response.token, user: response.user });
                }),
                catchError((error) => {
                    return of(AuthActions.loginFailure({ error }));
                })
            )
            ))
    );

    logout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');

                    // Important: tap is better for side effects like routing
                    this.router.navigate(['/login']);
                })

            ),
        { dispatch: false } // ❗ No action is dispatched from this effect
    );
}